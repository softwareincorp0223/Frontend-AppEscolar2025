import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerUsuarios = async (setUsuarios) => {
  try {
    const usuariosApi = await InstitutoData("usuario?include=Rol&sid_instituto=");
    const formateados = usuariosApi.map((u) => ({
      ...u,
      Rol: u.Rol?.nombre || "Sin rol",
      Fecha: fechaFormateada(u?.creacion, { paraUI: true }) || "Sin Fecha",
    }));
    setUsuarios(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const obtenerRoles = async (setRoles) => {
  try {
    const rolesApi = await InstitutoData("rol?sid_instituto=");
    setRoles(rolesApi);
  } catch (error) {
    showAlert("error", "Error al obtener roles");
  }
};

export const handleDelete = async (row, obtenerUsuarios) => {
  const result = await showAlert("delete", "¿Deseas eliminar este usuario?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`usuario/${row.id_usuario}`);
  await obtenerUsuarios(); // refrescar tabla
  showAlert("success", "Usuario eliminado correctamente");
};

export const handleSave = async (values, editingUser, setEditingUser, obtenerUsuarios) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada(new Date());

  const payload = {
    id_usuario: editingUser ? editingUser.id_usuario : null,
    nombre: values.nombre,
    apellido: values.apellido,
    correo: values.correo,
    contrasena: values.password,
    sid_rol: values.rol,
    creacion: editingUser ? editingUser.creacion : fecha,
    modificacion: fecha,
    sid_instituto,
  };

  if (editingUser) {
    await InstitutoDataUpdate(`usuario/${editingUser.id_usuario}`, payload);
    showAlert("success", "Usuario actualizado correctamente");
    setEditingUser(null);
  } else {
    console.log(payload);
    
    await InstitutoDataAdd("usuario", payload);
    showAlert("success", "Usuario agregado correctamente");
  }

  await obtenerUsuarios();
};
