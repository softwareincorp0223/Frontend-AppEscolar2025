import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerMaterias = async (setMaterias) => {
  try {
    const materiasApi = await InstitutoData("materia?&sid_instituto=");
    const formateados = materiasApi.map((u) => ({
      ...u,
      Rol: u.Rol?.nombre || "Sin rol",
    }));
    setMaterias(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener materias");
  }
};


export const handleDelete = async (row, obtenerMaterias) => {

  console.log(obtenerMaterias);
  const result = await showAlert("delete", "¿Deseas eliminar esta Materia?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`materia/${row.id_materia}`);
  await obtenerMaterias(); // refrescar tabla
  showAlert("success", "Materia eliminada correctamente");
};

export const handleSave = async (values, editingMateria, setEditingMateria, obtenerMaterias) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const payload = {
    id_materia: editingMateria ? editingMateria.id_materia : null,
    sid_grado: '0',
    nombre: values.nombre,
    sid_instituto
  };

   console.log("Payload enviado:", payload);

  if (editingMateria) {
    await InstitutoDataUpdate(`materia/${editingMateria.id_materia}`, payload);
    showAlert("success", "Materia actualizada correctamente");
    setEditingMateria(null);
  } else {
    await InstitutoDataAdd("materia", payload);
    showAlert("success", "Materia agregada correctamente");
  }

  await obtenerMaterias();
};
