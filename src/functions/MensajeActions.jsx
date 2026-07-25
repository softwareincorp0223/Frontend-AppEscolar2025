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
import { compressImage } from "./general/ImageCompresor";

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

    const formateados = mensajesApi.map((data) => ({
      ...data,
      urls: alumnoUrls,
      archivos: alumnoArchivos,
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

const asignarAlumnosMensaje = async (
  sid_mensaje,
  receptor,
  values,
  sid_instituto,
) => {
  let alumnos = [];

  switch (Number(receptor)) {
    // ESTUDIANTE
    case 1:
      alumnos = [
        {
          sid_alumno: values.sid_estudiante,
        },
      ];

      break;

    // NIVEL / GRADO / GRUPO
    case 2: {
      const filtros = [];

      if (values.sid_nivel && values.sid_nivel !== "0") {
        filtros.push(`sid_nivel=${values.sid_nivel}`);
      }

      if (values.sid_grado && values.sid_grado !== "0") {
        filtros.push(`sid_grado=${values.sid_grado}`);
      }

      if (values.sid_grupo && values.sid_grupo !== "0") {
        filtros.push(`sid_grupo=${values.sid_grupo}`);
      }

      alumnos = await InstitutoDataFilter(`alumno?${filtros.join("&")}`);

      break;
    }

    // MASIVO
    case 3:
      alumnos = await InstitutoDataFilter(
        `alumno?sid_instituto=${sid_instituto}`,
      );

      break;

    // ESPECIFICO
    case 4:
      // Pendiente
      alumnos = [];

      break;

    // EXTRACURRICULAR
    case 5:
      alumnos = await InstitutoDataFilter(
        `alumno_extracurricular/excel/${sid_instituto}`,
      );

      break;

    default:
      alumnos = [];
  }
  console.log("alumnos");
  console.log(alumnos);

  for (const alumno of alumnos) {
    await InstitutoDataAdd("asignar_mensaje", {
      id_asignar_mensaje: "",
      sid_mensaje,
      sid_alumno: alumno.sid_alumno || alumno.id_alumno,
      respuesta_rapida: values.respuesta_rapida_mensaje ? "si" : "no",
      leido: "no",
    });
  }
};

export const handleSaveMensaje = async (values, editingMensaje) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");
    const ahora = new Date();

    const formData = new FormData();

    // Datos mensaje

    formData.append(
      "id_mensaje",
      editingMensaje ? editingMensaje.id_mensaje : "",
    );

    formData.append("sid_tipo", values.sid_tipo !== "0" ? values.sid_tipo : "");

    formData.append(
      "sid_alumno",
      values.sid_estudiante !== "0" ? values.sid_estudiante : "",
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
    formData.append("asunto", values.asunto_mensaje || "");
    formData.append("mensaje", values.mensaje || "");

    formData.append(
      "respuesta_rapida",
      values.respuesta_rapida_mensaje ? 1 : 0,
    );

    formData.append("mensaje_programado", values.programado_mensaje ? 1 : 0);
    formData.append("repetir", values.repetir_mensaje ? 1 : 0);
    formData.append(
      "fecha_envio",
      values.fecha_envio_mensaje || ahora.toLocaleDateString("en-CA"),
    );

    formData.append(
      "hora_envio",
      values.hora_envio_mensaje ||
        ahora.toLocaleTimeString("es-MX", { hour12: false }),
    );
    formData.append("periodo", values.periodo_mensaje || "");
    formData.append("fecha_fin", values.fecha_fin_mensaje || "");
    formData.append("leido", "no");
    formData.append("eliminado", "no");

    // GUARDAR MENSAJE

    if (editingMensaje) {
      await InstitutoDataUpdate(
        `mensaje/${editingMensaje.id_mensaje}`,
        formData,
      );

      showAlert("success", "Mensaje actualizado correctamente");
    } else {
      console.log("formData");
      console.log(formData);

      const response = await InstitutoDataAdd("mensaje", formData);

      // ESTE ES EL IMPORTANTE
      const sid_mensaje = response.id_mensaje;

      // GUARDAR URLS
      try {
        if (values.urls?.length) {
          for (const item of values.urls) {
            await InstitutoDataAdd("url_mensaje", {
              id_url: "",
              sid_mensaje,
              url: item.url || item,
            });
          }
        }
      } catch (error) {
        console.error("Error guardando URLs:", error);
      }

      // GUARDAR ARCHIVOS
      try {
        if (values.archivos?.length) {
          const archivosForm = new FormData();

          for (const file of values.archivos) {
            const archivoComprimido = await compressImage(file);
            archivosForm.append("files", archivoComprimido);
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
      }

      // ASIGNAR ALUMNOS

      console.log(" ASIGNAR ALUMNOS");
      console.log(sid_mensaje, values.sid_tipo, values, sid_instituto);

      await asignarAlumnosMensaje(
        sid_mensaje,
        values.receptor,
        values,
        sid_instituto,
      );

      showAlert("success", "Mensaje agregado correctamente");
      return true;
    }

    await obtenerMensajes();
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    }

    showAlert("error", "Error al guardar el mensaje");

    return false;
  }
};
