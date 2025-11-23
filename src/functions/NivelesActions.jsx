import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerNiveles = async (setNiveles) => {
  try {
    const nivelesApi = await InstitutoData("nivel?&sid_instituto=");
    const formateados = nivelesApi.map((u) => ({
      ...u,
      Rol: u.Rol?.nombre || "Sin rol",
    }));
    setNiveles(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener niveles");
  }
};


export const handleDelete = async (row, obtenerNiveles) => {

  console.log(obtenerNiveles);
  const result = await showAlert("delete", "¿Deseas eliminar este nivel?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`nivel/${row.id_nivel}`);
  await obtenerNiveles(); // refrescar tabla
  showAlert("success", "Nivel eliminado correctamente");
};

export const handleSave = async (values, editingNivel, setEditingNivel, obtenerNiveles) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();
  
  const payload = {
    id_nivel: editingNivel ? editingNivel.id_nivel : null,
    sid_instituto,
    nombre: values.nombre,
    orden: '1',
  };

   console.log("Payload enviado:", payload);

  if (editingNivel) {
    await InstitutoDataUpdate(`nivel/${editingNivel.id_nivel}`, payload);
    showAlert("success", "Nivel actualizado correctamente");
    setEditingNivel(null);
  } else {
    await InstitutoDataAdd("nivel", payload);
    showAlert("success", "Nivel agregado correctamente");
  }

  await obtenerNiveles();
};
