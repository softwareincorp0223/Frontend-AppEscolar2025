import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

export const obtenerEvaluacion = async (setEvaluacion) => {
  try{
    const evaluacionApi = await InstitutoData(
      "evaluacion/calificacion/"
    );

    const dataFormateada = evaluacionApi.map((item) => ({
      id_evaluacion: item.id_evaluacion,
      alumno: `${item.Alumno?.nombre || ""} ${item.Alumno?.apellido || ""}`,
      ciclo: item.ciclo,
      nivel: item.Alumno?.Nivel?.nombre || "",
      grado: item.Alumno?.Grado?.nombre || "",
      grupo: item.Alumno?.Grupo?.nombre || "",
    }));

    setEvaluacion(dataFormateada);

  }catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener Evaluación");
  }
};

export const handleDelete = async (row, obtenerEvaluacion) => {
  const result = await showAlert("delete", "¿Deseas eliminar esta calificación?");

  console.log(row)
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`evaluacion/${row.id_evaluacion}`);
  await obtenerEvaluacion(); // refrescar tabla
  showAlert("success", "Calificación eliminada correctamente");
};