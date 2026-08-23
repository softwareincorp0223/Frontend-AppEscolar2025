import { showAlert } from "./general/Alerts";
import Swal from "sweetalert2";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";
import {
  MAX_UPLOAD_FILE_SIZE_MB,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  prepareFileForUpload,
} from "./general/ImageCompresor";

const hasSelectedValue = (value) =>
  value !== undefined && value !== null && value !== "" && value !== "0";

const getArchivosValidos = (values) =>
  (values.archivos || []).filter((archivo) => archivo instanceof File);

const validarArchivosTarea = (values) => {
  const archivos = getArchivosValidos(values);
  const archivoPesado = archivos.find(
    (archivo) => archivo.size > MAX_UPLOAD_FILE_SIZE_BYTES
  );

  if (archivoPesado) {
    throw new Error(
      `El archivo "${archivoPesado.name}" pesa más de ${MAX_UPLOAD_FILE_SIZE_MB} MB.`
    );
  }

  return archivos;
};

const validarCamposTarea = (values) => {
  if (!hasSelectedValue(values.nivel_tarea)) {
    throw new Error("Selecciona un nivel.");
  }

  if (!hasSelectedValue(values.grado_tarea)) {
    throw new Error("Selecciona un grado.");
  }

  if (!hasSelectedValue(values.grupo_tarea)) {
    throw new Error("Selecciona un grupo.");
  }

  if (!hasSelectedValue(values.materia_tarea)) {
    throw new Error("Selecciona una materia.");
  }
};

const obtenerAlumnosParaTarea = async (values, sid_instituto) => {
  const filtros = [`sid_instituto=${sid_instituto}`];

  if (hasSelectedValue(values.nivel_tarea)) {
    filtros.push(`sid_nivel=${values.nivel_tarea}`);
  }

  if (hasSelectedValue(values.grado_tarea)) {
    filtros.push(`sid_grado=${values.grado_tarea}`);
  }

  if (hasSelectedValue(values.grupo_tarea)) {
    filtros.push(`sid_grupo=${values.grupo_tarea}`);
  }

  const alumnos = await InstitutoDataFilter(`alumno?${filtros.join("&")}`);

  if (!alumnos.length) {
    throw new Error(
      "No hay alumnos asignados para el grupo de esta materia."
    );
  }

  return alumnos;
};

const asignarAlumnosTarea = async (sid_tarea, alumnos) => {
  const alumnoIds = [
    ...new Set(alumnos.map((alumno) => alumno.id_alumno).filter(Boolean)),
  ];
  const batchSize = 10;

  for (let index = 0; index < alumnoIds.length; index += batchSize) {
    const batch = alumnoIds.slice(index, index + batchSize);

    await Promise.all(
      batch.map((sid_alumno) =>
        InstitutoDataAdd("asignar_tarea", {
          id_asignar_tarea: "",
          sid_tarea,
          sid_alumno,
          estatus: "PENDIENTE",
          leido: "no",
        })
      )
    );
  }
};

const enviarNotificacionTarea = async (sid_tarea, alumnos) => {
  const sid_alumnos = [
    ...new Set(alumnos.map((alumno) => alumno.id_alumno).filter(Boolean)),
  ];

  if (!sid_tarea || !sid_alumnos.length) return;

  try {
    await InstitutoDataAdd(`mobile/notificaciones/tareas/${sid_tarea}/enviar`, {
      sid_alumnos,
    });
  } catch (error) {
    console.error("No se pudo enviar la notificacion de tarea", error);
  }
};

export const obtenerTareas = async (setTareas) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const tareasApi = await InstitutoDataFilter(
      "vistatareas?sid_instituto=" + sid_instituto
    );

    console.log(tareasApi);

    const formateados = tareasApi.map((a) => ({
      ...a,
      id: a.id_tareas,
      nivel: a.nombre_nivel || "Sin nivel",
      grado: a.nombre_grado || "Sin grado",
      grupo: a.nombre_grupo || "Sin grupo",
      creada: fechaFormateada(a.fecha_creacion, { paraUI: true }) || "Sin fecha",
      profesor: a.nombre_profesor + " " + a.apellido_profesor,
    }));

    setTareas(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};

export const handleDelete = async (row, obtenerTareas) => {
  const result = await showAlert("delete", "¿Deseas eliminar esta tarea?");
  if (!result.isConfirmed) return;

  const asignaciones = await InstitutoDataFilter(
    "asignar_tarea?sid_tarea=" + row.id_tareas
  );
  const asignacionesIds = asignaciones.map((item) => item.id_asignar_tarea);

  if (asignacionesIds.length > 0) {
    await InstitutoDataDelete(
      asignacionesIds,
      "archivo_respuesta_tarea",
      "sid_asignar_tarea"
    );
  }

  await InstitutoDataDelete([row.id_tareas], "asignar_tarea", "sid_tarea");
  await InstitutoDataDelete([row.id_tareas], "archivo_tarea", "sid_tarea");
  await InstitutoDataDelete([row.id_tareas], "url_tarea", "sid_tarea");
  await InstitutoDataDelete(`tareas/${row.id_tareas}`);

  await obtenerTareas();
  showAlert("success", "Tarea eliminada correctamente");
};

export const handleDeleteVarios = async (ids, setTareas) => {
  if (ids.length == 0) {
    showAlert("error", "Selecciona las tareas que deseas eliminar.");
    return;
  }

  const result = await showAlert("delete", "¿Deseas eliminar varias tareas?");
  if (!result.isConfirmed) return;

  const where = encodeURIComponent(
    JSON.stringify({
      sid_tarea: {
        $in: ids,
      },
    })
  );
  const asignaciones = await InstitutoDataFilter("asignar_tarea?where=" + where);
  const asignacionesIds = asignaciones.map((item) => item.id_asignar_tarea);

  if (asignacionesIds.length > 0) {
    await InstitutoDataDelete(
      asignacionesIds,
      "archivo_respuesta_tarea",
      "sid_asignar_tarea"
    );
  }

  await InstitutoDataDelete(ids, "asignar_tarea", "sid_tarea");
  await InstitutoDataDelete(ids, "archivo_tarea", "sid_tarea");
  await InstitutoDataDelete(ids, "url_tarea", "sid_tarea");
  await InstitutoDataDelete(ids, "tareas", "id_tareas");

  await obtenerTareas(setTareas);
  showAlert("success", "Tareas eliminadas correctamente");
};

export const obtenerAlumnosTarea = async (tarea_id, setTareas) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const tareasApi = await InstitutoDataFilter(
      "vistatareas?id_tareas=" + tarea_id
    );

    const alumnosApi = await InstitutoDataFilter(
      "asignar_tarea?include=Alumno&sid_tarea=" + tarea_id
    );

    const alumnoUrls = await InstitutoDataFilter(
      "url_tarea?sid_tarea=" + tarea_id
    );

    const alumnoArchivos = await InstitutoDataFilter(
      "archivo_tarea?sid_tarea=" + tarea_id
    );

    const asignacionesIds = alumnosApi
      .map((data) => data.id_asignar_tarea)
      .filter(Boolean);

    const archivosRespuestaApi = (
      await Promise.all(
        asignacionesIds.map((idAsignarTarea) =>
          InstitutoDataFilter(
            "archivo_respuesta_tarea?sid_asignar_tarea=" + idAsignarTarea
          )
        )
      )
    ).flat();

    const archivoRespuestaPorAsignacion = archivosRespuestaApi.reduce(
      (map, item) => {
        if (!item.sid_asignar_tarea || !item.archivo) return map;
        map[item.sid_asignar_tarea] = item.archivo;
        return map;
      },
      {}
    );

    const formateados = tareasApi.map((a) => ({
      ...a,
      id: a.id_tareas,
      nivel: a.nombre_nivel || "Sin nivel",
      grado: a.nombre_grado || "Sin grado",
      grupo: a.nombre_grupo || "Sin grupo",
      creada: fechaFormateada(a.fecha_creacion, { paraUI: true }) || "Sin fecha",
      profesor: a.nombre_profesor + " " + a.apellido_profesor,
      alumnos: alumnosApi.map((data) => ({
        ...data,
        alumno:
          `${data.Alumno?.nombre || ""} ${data.Alumno?.apellido || ""}`.trim() ||
          "Sin alumno",
        matricula: data.Alumno?.matricula || "Sin matrícula",
        archivo: archivoRespuestaPorAsignacion[data.id_asignar_tarea] || "",
      })),
      urls: alumnoUrls,
      archivos: alumnoArchivos,
    }));

    setTareas(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};

export const obtenerUrlsTarea = async (tarea_id, setUrls) => {
  try {
    const urlsApi = await InstitutoDataFilter("url_tarea?sid_tarea=" + tarea_id);
    setUrls(urlsApi);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener URLs de la tarea");
  }
};

export const obtenerArchivosTarea = async (tarea_id, setArchivos) => {
  try {
    const archivosApi = await InstitutoDataFilter(
      "archivo_tarea?sid_tarea=" + tarea_id
    );
    setArchivos(archivosApi);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener archivos de la tarea");
  }
};

export const obtenerArchivosRespuestaTarea = async (
  id_asignar_tarea,
  setArchivos
) => {
  try {
    const archivosApi = await InstitutoDataFilter(
      "archivo_respuesta_tarea?sid_asignar_tarea=" + id_asignar_tarea
    );
    setArchivos(archivosApi);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener archivos de respuesta");
  }
};

export const handleUpdateAsignarTarea = async (row, values, obtenerAlumnos) => {
  try {
    const payload = {
      id_asignar_tarea: row.id_asignar_tarea,
      sid_tarea: row.sid_tarea,
      sid_alumno: row.sid_alumno,
      estatus: values.estatus,
      leido: row.leido || "no",
    };

    if (values.observacion?.trim()) {
      payload.observacion = values.observacion.trim();
    }

    await InstitutoDataUpdate(
      `asignar_tarea/${row.id_asignar_tarea}`,
      payload
    );

    await obtenerAlumnos();
    showAlert("success", "Tarea actualizada correctamente");
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al actualizar la tarea");
  }
};

export const handleDeleteAsignarTarea = async (row, obtenerAlumnos) => {
  const result = await showAlert("delete", "¿Deseas eliminar este alumno?");
  if (!result.isConfirmed) return;

  await InstitutoDataDelete(
    [row.id_asignar_tarea],
    "archivo_respuesta_tarea",
    "sid_asignar_tarea"
  );
  await InstitutoDataDelete(`asignar_tarea/${row.id_asignar_tarea}`);
  await obtenerAlumnos();
  showAlert("success", "Alumno eliminado correctamente");
};

export const handleSaveTarea = async (values, editingTarea = null) => {
  let loaderActivo = false;

  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    validarCamposTarea(values);
    const archivos = validarArchivosTarea(values);

    Swal.fire({
      title: editingTarea ? "Actualizando tarea" : "Enviando tarea",
      text: "Por favor espera...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    loaderActivo = true;

    const alumnos = editingTarea
      ? []
      : await obtenerAlumnosParaTarea(values, sid_instituto);

    const payload = {
      id_tareas: editingTarea ? editingTarea.id_tarea : "",
      sid_grupo: values.grupo_tarea,
      sid_materia: values.materia_tarea,
      instrucciones_tarea: values.instrucciones,
      sid_instituto,
      fecha_creacion: new Date().toISOString(),
    };

    if (editingTarea) {
      await InstitutoDataUpdate(`tareas/${editingTarea.id_tarea}`, payload);

      Swal.close();
      loaderActivo = false;
      showAlert("success", "Tarea actualizada correctamente");
      return true;
    }

    const response = await InstitutoDataAdd("tareas", payload);
    const sid_tarea = response.id_tareas || response.id_tarea;

    const urls = (values.urls || [])
      .map((url) => (url || "").trim())
      .filter(Boolean);

    for (const url of urls) {
      await InstitutoDataAdd("url_tarea", {
        id_url_tarea: "",
        sid_tarea,
        url,
      });
    }

    if (archivos.length > 0) {
      const archivosForm = new FormData();

      for (const archivo of archivos) {
        const archivoParaSubir = await prepareFileForUpload(archivo);
        archivosForm.append("files", archivoParaSubir, archivo.name);
      }

      const responseFiles = await InstitutoDataAdd("drive/upload", archivosForm);

      if (responseFiles.ok && responseFiles.files?.length) {
        for (const archivo of responseFiles.files) {
          await InstitutoDataAdd("archivo_tarea", {
            id_archivo_tarea: "",
            sid_tarea,
            url: archivo.url,
          });
        }
      }
    }

    await asignarAlumnosTarea(sid_tarea, alumnos);
    await enviarNotificacionTarea(sid_tarea, alumnos);

    Swal.close();
    loaderActivo = false;
    showAlert("success", "Tarea enviada correctamente");
    return true;
  } catch (error) {
    console.error(error);

    if (loaderActivo) {
      Swal.close();
    }

    showAlert("error", error.message || "Error al guardar la tarea");
    return false;
  }
};
