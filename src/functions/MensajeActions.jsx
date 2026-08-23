import { showAlert } from "./general/Alerts";
import Swal from "sweetalert2";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";
import { mapReceptor } from "./general/Functions";
import {
  MAX_UPLOAD_FILE_SIZE_MB,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  prepareFileForUpload,
} from "./general/ImageCompresor";

const TRUE_VALUES = ["si", "sí", "1", 1, true, "true"];

const isTruthyValue = (value) =>
  TRUE_VALUES.includes(
    typeof value === "string" ? value.trim().toLowerCase() : value,
  );

const boolToDb = (value) => (isTruthyValue(value) ? "si" : "no");

const hasSelectedValue = (value) =>
  value !== undefined && value !== null && value !== "" && value !== "0";

const appendIfHasValue = (formData, key, value) => {
  if (hasSelectedValue(value)) {
    formData.append(key, value);
  }
};

const closeMensajeLoader = () => {
  Swal.hideLoading();
  Swal.close();
};

const getSelectedStudentIds = (values) => {
  const ids = values.sid_estudiantes?.length
    ? values.sid_estudiantes
    : [values.sid_estudiante];

  return [...new Set(ids.map(String).filter(hasSelectedValue))];
};

const getArchivosValidos = (values) =>
  (values.archivos || []).filter((file) => file instanceof File);

const validarArchivosMensaje = (values) => {
  const archivos = getArchivosValidos(values);
  const archivoPesado = archivos.find(
    (file) => file.size > MAX_UPLOAD_FILE_SIZE_BYTES,
  );

  if (archivoPesado) {
    throw new Error(
      `El archivo "${archivoPesado.name}" pesa más de ${MAX_UPLOAD_FILE_SIZE_MB} MB.`,
    );
  }

  return archivos;
};

export const obtenerMensajes = async (setMensajes) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const mensajesApi = await InstitutoDataFilter(
      "vista-mensajes?sid_instituto=" + sid_instituto + "&eliminado=no",
    );

    const formateados = mensajesApi.map((data) => ({
      ...data,
      receptor: mapReceptor(data.receptor),
      fecha_de_envio:
        fechaFormateada(data?.fecha_envio, { paraUI: true }) ?? "Sin fecha",
    }));

    setMensajes(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener Mensajes");
  }
};

export const obtenerMensajesExcel = async (setMensajesExcel) => {
  try {
    const mensajesApi = await InstitutoData("vista-mensajes/excel/");

    const formateados = mensajesApi.map((data) => ({
      Receptor: mapReceptor(data.receptor),
      Envio: data.nombre_tipo || "",
      NumDestinatario: data.destinatarios || "",
      Asunto: data.asunto || "",
      Fecha:
        fechaFormateada(data?.fecha_envio, { paraUI: true }) ?? "Sin fecha",
    }));

    setMensajesExcel(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener Mensajes para Excel");
  }
};

export const obtenerMensaje = async (mensaje_id, setMensaje) => {
  try {
    const mensajesApi = await InstitutoDataFilter(
      "mensaje?id_mensaje=" + mensaje_id,
    );

    const alumnoUrls = await InstitutoDataFilter(
      "url_mensaje?sid_mensaje=" + mensaje_id,
    );

    const alumnoArchivos = await InstitutoDataFilter(
      "archivo_mensaje?sid_mensaje=" + mensaje_id,
    );

    const urls = alumnoUrls.filter((item) => (item.url || "").trim());
    const archivos = alumnoArchivos.filter((item) => (item.url || "").trim());

    const formateados = mensajesApi.map((data) => ({
      ...data,
      urls,
      archivos,
    }));

    console.log("formateados");
    console.log(mensajesApi);

    setMensaje(formateados[0] || null);
  } catch (error) {
    showAlert("error", "Error al obtener Mensajes");
  }
};

export const obtenerAlumnosMensaje = async (mensaje_id, setAlumnos) => {
  try {
    const alumnosApi = await InstitutoDataFilter(
      "vista_asignar_mensaje_alumno?sid_mensaje=" + mensaje_id,
    );

    setAlumnos(alumnosApi);
  } catch (error) {
    showAlert("error", "Error al obtener Alumnos");
  }
};

export const handleDelete = async (row, obtenerMensajes) => {
  const result = await showAlert("delete", "¿Deseas eliminar este mensaje?");
  if (!result.isConfirmed) return;

  const payload = {
    id_mensaje: row.id_mensaje,
    eliminado: "si",
  };

  const data = await InstitutoDataUpdate(`mensaje/${row.id_mensaje}`, payload);

  await obtenerMensajes(); // refrescar tabla
  showAlert("success", "Mensaje eliminado correctamente");
};

export const handleRestore = async (row, obtenerRegistroMensajes) => {
  const result = await showAlert("warning", "¿Deseas restaurar este mensaje?");
  if (!result.isConfirmed) return;

  const payload = {
    id_mensaje: row.id_mensaje,
    eliminado: "no",
  };

  const data = await InstitutoDataUpdate(`mensaje/${row.id_mensaje}`, payload);
  console.log(data);

  await obtenerRegistroMensajes(); // refrescar tabla
  showAlert("success", "Mensaje restaurado correctamente");
};

export const handleDeleteVarios = async (ids, setMensajes) => {
  if (ids.length == 0) {
    showAlert("error", "Selecciona los mensajes que deseas eliminar.");
    return;
  }

  const result = await showAlert("delete", "¿Deseas eliminar varios mensajes?");
  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Eliminando mensajes",
    text: "Por favor espera...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await InstitutoDataDelete(ids, "asignar_mensaje", "sid_mensaje");
    await InstitutoDataDelete(ids, "archivo_mensaje", "sid_mensaje");
    await InstitutoDataDelete(ids, "url_mensaje", "sid_mensaje");
    await InstitutoDataDelete(ids, "mensaje", "id_mensaje");

    await obtenerMensajes(setMensajes);

    Swal.close();
    showAlert("success", "Mensajes eliminados correctamente");
  } catch (error) {
    Swal.close();
    showAlert("error", "Error al eliminar los mensajes");
  }
};

const obtenerAlumnosPorReceptor = async (receptor, values, sid_instituto) => {
  switch (Number(receptor)) {
    // ESTUDIANTE
    case 1:
      return getSelectedStudentIds(values).map((sidAlumno) => ({
        sid_alumno: sidAlumno,
      }));

    // NIVEL / GRADO / GRUPO
    case 2: {
      const filtros = [`sid_instituto=${sid_instituto}`];

      if (values.sid_nivel && values.sid_nivel !== "0") {
        filtros.push(`sid_nivel=${values.sid_nivel}`);
      }

      if (values.sid_grado && values.sid_grado !== "0") {
        filtros.push(`sid_grado=${values.sid_grado}`);
      }

      if (values.sid_grupo && values.sid_grupo !== "0") {
        filtros.push(`sid_grupo=${values.sid_grupo}`);
      }

      return await InstitutoDataFilter(`alumno?${filtros.join("&")}`);
    }

    // MASIVO
    case 3:
      return await InstitutoDataFilter(
        `alumno?sid_instituto=${sid_instituto}`,
      );

    // ESPECIFICO
    case 4:
      return getSelectedStudentIds(values).map((sidAlumno) => ({
        sid_alumno: sidAlumno,
      }));

    // EXTRACURRICULAR
    case 5:
      return await InstitutoDataFilter(
        `alumno_extracurricular?sid_extracurricular=${values.sid_extracurricular}`,
      );

    default:
      return [];
  }
};

const validarCamposObligatoriosMensaje = (values) => {
  const faltantes = [];
  const receptor = Number(values.receptor);

  if (!hasSelectedValue(values.receptor)) {
    faltantes.push("Receptor");
  }

  if (!hasSelectedValue(values.sid_tipo)) {
    faltantes.push("Tipo de mensaje");
  }

  if ((receptor === 1 || receptor === 4) && !getSelectedStudentIds(values).length) {
    faltantes.push(receptor === 4 ? "Estudiantes especificos" : "Estudiante");
  }

  if (receptor === 2 && !hasSelectedValue(values.sid_nivel)) {
    faltantes.push("Nivel");
  }

  if (receptor === 5 && !hasSelectedValue(values.sid_extracurricular)) {
    faltantes.push("Actividad extracurricular");
  }

  if (!faltantes.length) return;

  throw new Error(
    `Completa los datos obligatorios del mensaje:\n${faltantes
      .map((campo) => `- ${campo}`)
      .join("\n")}`,
  );
};

const validarDestinatariosMensaje = async (values, sid_instituto) => {
  if (!hasSelectedValue(values.receptor)) {
    throw new Error("Selecciona un receptor.");
  }

  if (!hasSelectedValue(values.sid_tipo)) {
    throw new Error("Selecciona el tipo de mensaje.");
  }

  if (Number(values.receptor) === 2 && !hasSelectedValue(values.sid_nivel)) {
    throw new Error("Selecciona al menos un nivel para el receptor.");
  }

  if (
    Number(values.receptor) === 5 &&
    !hasSelectedValue(values.sid_extracurricular)
  ) {
    throw new Error("Selecciona una actividad extracurricular.");
  }

  const alumnos = await obtenerAlumnosPorReceptor(
    values.receptor,
    values,
    sid_instituto,
  );

  const alumnosValidos = alumnos.filter(
    (alumno) => hasSelectedValue(alumno.sid_alumno || alumno.id_alumno),
  );

  if (!alumnosValidos.length) {
    throw new Error("No hay alumnos para asignar el mensaje.");
  }

  return alumnosValidos;
};

const asignarAlumnosMensaje = async (sid_mensaje, values, alumnos) => {
  const alumnoIds = [
    ...new Set(
      alumnos
        .map((alumno) => alumno.sid_alumno || alumno.id_alumno)
        .filter(hasSelectedValue),
    ),
  ];

  const batchSize = 10;

  for (let index = 0; index < alumnoIds.length; index += batchSize) {
    const batch = alumnoIds.slice(index, index + batchSize);

    await Promise.all(
      batch.map((sid_alumno) =>
        InstitutoDataAdd("asignar_mensaje", {
          id_asignar_mensaje: "",
          sid_mensaje,
          sid_alumno,
          respuesta_rapida: boolToDb(values.respuesta_rapida_mensaje),
          leido: "no",
        }),
      ),
    );
  }

  return alumnoIds.length;
};

const enviarNotificacionMensajeInmediato = async (sid_mensaje, values, alumnos) => {
  if (isTruthyValue(values.programado_mensaje)) {
    return null;
  }

  const sidAlumnos = [
    ...new Set(
      alumnos
        .map((alumno) => alumno.sid_alumno || alumno.id_alumno)
        .filter(hasSelectedValue),
    ),
  ];

  if (!sidAlumnos.length) {
    return null;
  }

  try {
    return await InstitutoDataAdd(`mobile/notificaciones/mensajes/${sid_mensaje}/enviar`, {
      sid_alumnos: sidAlumnos,
    });
  } catch (error) {
    console.error("Error enviando notificacion push del mensaje:", error);
    return null;
  }
};

export const handleSaveMensaje = async (values, editingMensaje) => {
  let loaderActivo = false;

  try {
    const sid_instituto = localStorage.getItem("sid_instituto");
    const ahora = new Date();
    const fechaHoy = ahora.toLocaleDateString("en-CA");
    const horaActual = ahora.toLocaleTimeString("es-MX", { hour12: false });
    const archivos = validarArchivosMensaje(values);

    validarCamposObligatoriosMensaje(values);

    Swal.fire({
      title: editingMensaje ? "Actualizando mensaje" : "Enviando mensaje",
      text: "Por favor espera...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    loaderActivo = true;

    const alumnosDestinatarios = await validarDestinatariosMensaje(
      values,
      sid_instituto,
    );

    if (!alumnosDestinatarios) {
      closeMensajeLoader();
      loaderActivo = false;
      return false;
    }

    const formData = new FormData();

    // Datos mensaje

    formData.append(
      "id_mensaje",
      editingMensaje ? editingMensaje.id_mensaje : "",
    );

    formData.append("sid_tipo", values.sid_tipo !== "0" ? values.sid_tipo : "");

    formData.append(
      "sid_alumno",
      alumnosDestinatarios[0]?.sid_alumno ||
        alumnosDestinatarios[0]?.id_alumno ||
        (values.sid_estudiante !== "0" ? values.sid_estudiante : ""),
    );
    formData.append(
      "sid_nivel",
      values.sid_nivel !== "0" ? values.sid_nivel : "vacio",
    );
    formData.append(
      "sid_grado",
      values.sid_grado !== "0" ? values.sid_grado : "vacio",
    );
    formData.append(
      "sid_grupo",
      values.sid_grupo !== "0" ? values.sid_grupo : "vacio",
    );
    formData.append(
      "sid_extracurricular",
      values.sid_extracurricular !== "0" ? values.sid_extracurricular : "vacio",
    );

    formData.append("sid_usuario_emisor", sid_instituto);
    formData.append("sid_instituto", sid_instituto);
    formData.append("receptor", values.receptor || "");
    formData.append("destinatarios", alumnosDestinatarios.length);
    formData.append("asunto", values.asunto_mensaje || "");
    formData.append("mensaje", values.mensaje || "");

    formData.append(
      "respuesta_rapida",
      boolToDb(values.respuesta_rapida_mensaje),
    );

    const mensajeProgramado = isTruthyValue(values.programado_mensaje);
    const repetirMensaje = mensajeProgramado && isTruthyValue(values.repetir_mensaje);

    formData.append("mensaje_programado", boolToDb(mensajeProgramado));
    formData.append("repetir", boolToDb(repetirMensaje));
    formData.append(
      "fecha_envio",
      mensajeProgramado
        ? values.fecha_envio_mensaje || fechaHoy
        : fechaHoy,
    );

    formData.append(
      "hora_envio",
      mensajeProgramado
        ? values.hora_envio_mensaje || horaActual
        : horaActual,
    );

    if (repetirMensaje) {
      appendIfHasValue(formData, "periodo", values.periodo_mensaje);
      appendIfHasValue(formData, "fecha_fin", values.fecha_fin_mensaje);
    }

    formData.append("leido", "no");
    formData.append("eliminado", "no");

    // GUARDAR MENSAJE

    if (editingMensaje) {
      await InstitutoDataUpdate(
        `mensaje/${editingMensaje.id_mensaje}`,
        formData,
      );

      closeMensajeLoader();
      loaderActivo = false;
      showAlert("success", "Mensaje actualizado correctamente");
      return true;
    } else {
      console.log("formData");
      console.log(formData);

      const response = await InstitutoDataAdd("mensaje", formData);

      // ESTE ES EL IMPORTANTE
      const sid_mensaje = response.id_mensaje;

      // GUARDAR URLS
      try {
        if (values.urls?.length) {
          const urls = values.urls
            .map((item) => (item.url || item || "").trim())
            .filter(Boolean);

          for (const url of urls) {
            await InstitutoDataAdd("url_mensaje", {
              id_url: "",
              sid_mensaje,
              url,
            });
          }
        }
      } catch (error) {
        console.error("Error guardando URLs:", error);
      }

      // GUARDAR ARCHIVOS
      try {
        if (archivos.length) {
          const archivosForm = new FormData();

          for (const file of archivos) {
            const archivoParaSubir = await prepareFileForUpload(file);

            archivosForm.append("files", archivoParaSubir, file.name);
          }

          const responseFiles = await InstitutoDataAdd(
            "drive/upload",
            archivosForm,
          );

          if (responseFiles.ok && responseFiles.files?.length) {
            for (const archivo of responseFiles.files) {
              await InstitutoDataAdd("archivo_mensaje", {
                id_archivo_mensaje: "",
                sid_mensaje,
                url: archivo.url,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error guardando archivos:", error);
        throw new Error(error.message || "Error guardando archivos adjuntos");
      }

      // ASIGNAR ALUMNOS

      console.log(" ASIGNAR ALUMNOS");
      console.log(sid_mensaje, values.sid_tipo, values, sid_instituto);

      const totalDestinatarios = await asignarAlumnosMensaje(
        sid_mensaje,
        values,
        alumnosDestinatarios,
      );

      if (String(totalDestinatarios) !== String(alumnosDestinatarios.length)) {
        await InstitutoDataUpdate(`mensaje/${sid_mensaje}`, {
          destinatarios: totalDestinatarios,
        });
      }

      await enviarNotificacionMensajeInmediato(
        sid_mensaje,
        values,
        alumnosDestinatarios,
      );

      closeMensajeLoader();
      loaderActivo = false;
      showAlert("success", "Mensaje agregado correctamente");
      return true;
    }

    await obtenerMensajes();
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    }

    if (loaderActivo) {
      closeMensajeLoader();
    }

    showAlert("error", error.message || "Error al guardar el mensaje");

    return false;
  }
};
