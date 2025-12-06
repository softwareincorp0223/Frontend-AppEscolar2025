import { showAlert } from "./general/Alerts";
import {
  InstitutoData,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

export const obtenerUsuario = async (setUsuario) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const usuarioApi = await InstitutoDataFilter(
      `usuario?include=Rol&id_usuario=${userId}`
    );

    setUsuario(usuarioApi);

  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const obtenerInstituto = async (setInstituto) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const institutoApi = await InstitutoDataFilter(
      `instituto?id_instituto=${sid_instituto}`
    );
    setInstituto(institutoApi);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const handleSave = async (values, editingInstituto, setEditingInstituto, obtenerInstituto) => {
  const id_instituto = localStorage.getItem("sid_instituto");

  const payload = {
    id_instituto,
    nombre: values.nombre,
    descripcion: values.descripcion,
  };

  console.log("Payload enviado:", payload);

  if (editingInstituto) {
    await InstitutoDataUpdate(`instituto/${id_instituto}`, payload);
    showAlert("success", "instituto actualizado correctamente");
    console.log("llegas");
    setEditingInstituto(null);
  } 

  await obtenerInstituto();
};