import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerAtributos = async (setAtributos) => {
  try {
    const atributosApi = await InstitutoData("atributo?sid_instituto=");
    setAtributos(atributosApi);
  } catch (error) {
    showAlert("error", "Error al obtener atributos");
  }
};


export const handleDelete = async (row, obtenerAtributos) => {
  const result = await showAlert("delete", "¿Deseas eliminar este atributo?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`atributo/${row.id_atributo}`);
  await obtenerAtributos(); // refrescar tabla
  showAlert("success", "Atributo eliminado correctamente");
};

export const handleSave = async (values, editingAtributo, setEditingAtributo, obtenerAtributos) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const user = JSON.parse(localStorage.getItem("user"));
  const sid_usuario = user.id;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, ":", localStorage.getItem(key));
  }

  const payload = {
    id_atributo: editingAtributo ? editingAtributo.id_atributo : null,
    icono: values.icono,
    nombre: values.nombre,
    sid_instituto,
    sid_usuario,
  };

   console.log("Payload enviado:", payload);


  if (editingAtributo) {
    await InstitutoDataUpdate(`atributo/${editingAtributo.id_atributo}`, payload);
    showAlert("success", "Atributo actualizado correctamente");
    setEditingAtributo(null);
  } else {
    await InstitutoDataAdd("atributo", payload);
    showAlert("success", "Atributo agregado correctamente");
  }

  await obtenerAtributos();
};
