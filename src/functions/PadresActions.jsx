import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";
import { generarCodigoQR } from "./general/Functions";

export const obtenerPadres = async (setPadres) => {
  try {
    const padresApi = await InstitutoData("padre?sid_instituto=");

    setPadres(padresApi);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const handleDelete = async (row, obtenerPadres) => {
  const result = await showAlert("delete", "¿Deseas eliminar este Padre?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`padre/${row.id_padre}`);
  await obtenerPadres(); // refrescar tabla
  showAlert("success", "Padre eliminado correctamente");
};

export const handleDeleteVarios = async (ids, setPadres) => {
  if (ids.length == 0) {
    showAlert("error", "Selecciona los padres que deseas eliminar.");
    return;
  }
  const result = await showAlert("delete", "¿Deseas eliminar varios Padres?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(ids, "padre", "id_padre");
  await obtenerPadres(setPadres); // refrescar tabla
  showAlert("success", "Padre eliminado correctamente");
};

export const handleSave = async (
  values,
  editing,
  setEditing,
  obtenerPadres
) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const generarPassword = () => Math.random().toString(36).slice(-10);

  const payload = {
    id_padre: editing ? editing.id_padre : null,
    nombre: values.nombre,
    apellido: values.apellido,
    correo: values.correo,
    creacion: editing ? editing.creacion : fecha,
    contrasena: editing ? editing.contrasena : generarPassword(),
    codigo_qr: editing ? editing.codigo_qr : generarCodigoQR(),
    sid_instituto,
  };

  if (editing) {
    await InstitutoDataUpdate(`padre/${editing.id_padre}`, payload);
    showAlert("success", "Padre actualizado correctamente");
    setEditing(null);
  } else {
    await InstitutoDataAdd("padre", payload);
    showAlert("success", "Padre agregado correctamente");
  }

  await obtenerPadres();
};
