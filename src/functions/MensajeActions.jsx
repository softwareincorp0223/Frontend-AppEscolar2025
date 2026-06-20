import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";
import { mapReceptor } from "./general/Functions";

export const obtenerMensajes = async (setMensajes) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const mensajesApi = await InstitutoDataFilter(
      "vista-mensajes?sid_instituto=" + sid_instituto,
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

export const obtenerMensaje = async (mensaje_id, setMensaje) => {
  try {
    const mensajesApi = await InstitutoDataFilter(
      "mensaje?id_mensaje=" + mensaje_id
    );

    const formateados = mensajesApi.map((data) => ({
      ...data,
    }));

    setMensaje(mensajesApi[0]);
  } catch (error) {
    showAlert("error", "Error al obtener Mensajes");
  }
}

export const obtenerAlumnosMensaje = async (mensaje_id, setAlumnos) => {
  try {
    const alumnosApi = await InstitutoDataFilter(
      'vista_asignar_mensaje_alumno?sid_mensaje=' + mensaje_id
    );

    setAlumnos(alumnosApi);
  } catch (error) {
    showAlert("error", "Error al obtener Alumnos");
  }
}

export const handleSaveMensaje = async (values, editingMensaje) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const formData = new FormData();

    // =========================
    // Datos mensaje
    // =========================

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
      values.sid_extracurricular !== "0"
        ? values.sid_extracurricular
        : "vacio",
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

    formData.append(
      "mensaje_programado",
      values.programado_mensaje ? 1 : 0,
    );

    formData.append("repetir", values.repetir_mensaje ? 1 : 0);

    formData.append("fecha_envio", values.fecha_envio_mensaje || "");

    formData.append("hora_envio", values.hora_envio_mensaje || "");

    formData.append("periodo", values.periodo_mensaje || "");

    formData.append("fecha_fin", values.fecha_fin_mensaje || "");

    formData.append("leido", "no");

    formData.append("eliminado", "no");

    // =========================
    // GUARDAR MENSAJE
    // =========================

    if (editingMensaje) {

      await InstitutoDataUpdate(
        `mensaje/${editingMensaje.id_mensaje}`,
        formData
      );

      showAlert("success", "Mensaje actualizado correctamente");

    } else {

      const response = await InstitutoDataAdd("mensaje", formData);

      console.log("RESPUESTA:", response);

      // ESTE ES EL IMPORTANTE
      const sid_mensaje = response.id_mensaje;

      // =========================
      // GUARDAR URLS
      // =========================

      console.log("VALORES URLS:", values.urls);
      console.log("SID MENSAJE:", sid_mensaje);

      if (values.urls && values.urls.length > 0) {

        for (const item of values.urls) {

          await InstitutoDataAdd("url_mensaje", {
            sid_mensaje,
            url: item.url || item,
          });

        }

      }

      // =========================
      // GUARDAR ARCHIVOS
      // =========================
/*
      if (values.archivos && values.archivos.length > 0) {

        for (const file of values.archivos) {

          const archivoForm = new FormData();

          archivoForm.append("sid_mensaje", sid_mensaje);

          archivoForm.append("archivo", file);

          await InstitutoDataAdd(
            "archivo_mensaje",
            archivoForm
          );

        }

      }
*/
      showAlert("success", "Mensaje agregado correctamente");
    }

    //await obtenerMensajes();

  } catch (error) {

    console.error(error);

    showAlert("error", "Error al guardar el mensaje");
  }
};
