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

export const obtenerTipoMensajes = async (setTipoMensajes) => {
  try {
    const tipoMensajeApi = await InstitutoData("tipo_mensaje?&sid_instituto=");
    setTipoMensajes(tipoMensajeApi);
  } catch (error) {
    showAlert("error", "Error al obtener Tipos de Mensajes");
  }
};

export const handleDelete = async (row, obtenerTipoMensajes) => {
  console.log(obtenerTipoMensajes);
  const result = await showAlert(
    "delete",
    "¿Deseas eliminar este Tipo de Mensaje?",
  );
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`tipo_mensaje/${row.id_tipo_mensaje}`);
  await obtenerTipoMensajes(); // refrescar tabla
  showAlert("success", "Tipo de Mensaje eliminado correctamente");
};

export const handleSave = async (
  values,
  editingTipoMensaje,
  setEditingTipoMensaje,
  obtenerTipoMensajes,
) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const payload = {
    id_tipo_mensaje: editingTipoMensaje
      ? editingTipoMensaje.id_tipo_mensaje
      : null,
    icono: values.icono,
    nombre: values.nombre,
    sid_instituto,
  };

  if (editingTipoMensaje) {
    await InstitutoDataUpdate(
      `tipo_mensaje/${editingTipoMensaje.id_tipo_mensaje}`,
      payload,
    );
    showAlert("success", "Tipo de Mensaje actualizado correctamente");
    setEditingTipoMensaje(null);
  } else {
    await InstitutoDataAdd("tipo_mensaje", payload);
    showAlert("success", "Tipo de Mensaje agregado correctamente");
  }

  await obtenerTipoMensajes();
};

export const obtenerMensajesHistorial = async (setHistorialMensajes) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const historialMensajeApi = await InstitutoDataFilter(
      "vista-historial-mensajes?sid_instituto=" + sid_instituto,
    );

    const formateados = historialMensajeApi.map((data) => ({
      ...data,
      emisor: `${data.nombre_instituto ?? ""}`.trim() || "Sin emisor",
      receptor:
        `${data?.nombre_alumno ?? ""} ${data?.apellido_alumno ?? ""}`.trim() ||
        "Sin emisor",
      destinatario: mapReceptor(data.receptor),

      fecha_envio: fechaFormateada(data?.fecha_envio, { paraUI: true }) ?? "Sin fecha",
      fecha_eliminacion:
        fechaFormateada(data?.fecha_eliminacion, { paraUI: true }) ?? "Sin fecha",
    }));

    setHistorialMensajes(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener Tipos de Mensajes");
  }
};
