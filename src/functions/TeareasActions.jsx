import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

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
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    // =========================
    // Datos tarea
    // =========================

    const payload = {
      id_tareas: editingTarea ? editingTarea.id_tarea : "",
      sid_grupo: values.grupo_tarea,
      sid_materia: values.materia_tarea,
      instrucciones_tarea: values.instrucciones,
      sid_instituto,
      fecha_creacion: new Date().toISOString(),
    };

    /*
    // ======================================
    // CUANDO SE SUBAN ARCHIVOS
    // ======================================

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    */

    // =========================
    // GUARDAR TAREA
    // =========================

    if (editingTarea) {

      await InstitutoDataUpdate(
        `tareas/${editingTarea.id_tarea}`,
        payload
        // formData
      );

      showAlert("success", "Tarea actualizada correctamente");

    } else {

      const response = await InstitutoDataAdd(
        "tareas",
        payload
        // formData
      );

      const sid_tarea = response.id_tareas || response.id_tarea;

      // =========================
      // GUARDAR URLS
      // =========================

      const urls = (values.urls || []).filter((url) => url?.trim());

      if (urls.length > 0) {
        for (const url of urls) {
          await InstitutoDataAdd("url_tarea", {
            id_url_tarea: "",
            sid_tarea,
            url: url.trim(),
          });
        }
      }

      // =========================
      // GUARDAR ARCHIVOS
      // =========================

      const archivos = (values.archivos || []).filter(Boolean);

      if (archivos.length > 0) {
        const archivosForm = new FormData();

        for (const archivo of archivos) {
          archivosForm.append("files", archivo);
        }

        const responseFiles = await InstitutoDataAdd(
          "drive/upload",
          archivosForm
        );

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

      // =========================
      // ASIGNAR ALUMNOS DEL GRUPO
      // =========================

      const filtros = [];

      if (values.nivel_tarea && values.nivel_tarea !== "0") {
        filtros.push(`sid_nivel=${values.nivel_tarea}`);
      }

      if (values.grado_tarea && values.grado_tarea !== "0") {
        filtros.push(`sid_grado=${values.grado_tarea}`);
      }

      if (values.grupo_tarea && values.grupo_tarea !== "0") {
        filtros.push(`sid_grupo=${values.grupo_tarea}`);
      }

      const alumnos = await InstitutoDataFilter(`alumno?${filtros.join("&")}`);

      for (const alumno of alumnos) {
        await InstitutoDataAdd("asignar_tarea", {
          id_asignar_tarea: "",
          sid_tarea,
          sid_alumno: alumno.id_alumno,
          estatus: "PENDIENTE",
          leido: "no",
        });
      }

      showAlert("success", "Tarea agregada correctamente");
      return true;
    }

  } catch (error) {

    console.error(error);

    showAlert("error", "Error al guardar la tarea");
    return false;

  }
};
