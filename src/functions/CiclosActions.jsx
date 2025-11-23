import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerCiclos = async (setCiclos) => {
  try {

    const ciclosApi = await InstitutoData("ciclo?&sid_instituto=");
    setCiclos(ciclosApi);
  } catch (error) {
    showAlert("error", "Error al obtener ciclos");
  }
};


export const handleDelete = async (row, obtenerCiclos) => {

  console.log(obtenerCiclos);
  const result = await showAlert("delete", "¿Deseas eliminar este ciclo?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`ciclo/${row.id_ciclo}`);
  await obtenerCiclos(); // refrescar tabla
  showAlert("success", "Ciclo eliminado correctamente");
};

export const handleSave = async (values, editingCiclo, setEditingCiclo, obtenerCiclos) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const payload = {
    id_ciclo: editingCiclo ? editingCiclo.id_ciclo : null,
    nombre: values.nombre,
    sid_instituto,
    ciclo_cerrado: 0,
    orden: 1,
  };

  console.log("Payload enviado:", payload);

  if (editingCiclo) {
    await InstitutoDataUpdate(`ciclo/${editingCiclo.id_ciclo}`, payload);
    showAlert("success", "Ciclo actualizado correctamente");
    setEditingCiclo(null);
  } else {
    await InstitutoDataAdd("ciclo", payload);
    showAlert("success", "Ciclo agregado correctamente");
  }

  await obtenerCiclos();
};
