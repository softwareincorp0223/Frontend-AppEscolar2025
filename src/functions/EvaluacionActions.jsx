import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";
import { ExportarPDFCalificacion } from "./general/ExportarPDFCalificacion";


export const obtenerEvaluacion = async (setEvaluacion) => {
  try {
    const evaluacionApi = await InstitutoData(
      "evaluacion/calificacion/"
    );

    const dataFormateada = evaluacionApi.flatMap((alumno) =>
      (alumno.Evaluacions || []).map((evaluacion) => ({
        id_evaluacion: evaluacion.id_evaluacion,
        id_alumno: alumno.id_alumno,
        alumno: `${alumno.nombre || ""} ${alumno.apellido || ""}`,
        ciclo: evaluacion.ciclo,
        nivel: alumno.Nivel?.nombre || "",
        grado: alumno.Grado?.nombre || "",
        grupo: alumno.Grupo?.nombre || "",
        promedio_general: evaluacion.promedio_general,
        promedio_final: evaluacion.promedio_final,
        fecha: evaluacion.fecha_registro
      }))
    );

    setEvaluacion(dataFormateada);

  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener Evaluación");
  }
};

// export const obtenerEvaluacion = async (setEvaluacion) => {
//   try{
//     const evaluacionApi = await InstitutoData(
//       "evaluacion/calificacion/"
//     );

//     const dataFormateada = evaluacionApi.map((item) => ({
//       id_evaluacion: item.id_evaluacion,
//       alumno: `${item.Alumno?.nombre || ""} ${item.Alumno?.apellido || ""}`,
//       ciclo: item.ciclo,
//       nivel: item.Alumno?.Nivel?.nombre || "",
//       grado: item.Alumno?.Grado?.nombre || "",
//       grupo: item.Alumno?.Grupo?.nombre || "",
//     }));

//     setEvaluacion(dataFormateada);

//   }catch (error) {
//     console.error(error);
//     showAlert("error", "Error al obtener Evaluación");
//   }
// };

export const handleDelete = async (row, obtenerEvaluacion) => {
  const result = await showAlert("delete", "¿Deseas eliminar esta calificación?");

  console.log(row)
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`evaluacion/${row.id_evaluacion}`);
  await obtenerEvaluacion(); // refrescar tabla
  showAlert("success", "Calificación eliminada correctamente");
};

export const obtenerCalificacionesExcel = async (setCalificacionesExcel) => {
  try {
    const data = await InstitutoData(
      "evaluacion/excel/"
    );

    const formateados = data.map((item) => ({
      Nombre: item.Alumno?.nombre || "Sin Nombre",
      Apellido: item.Alumno?.apellido || "Sin Apellido",
      Matricula: item.Alumno?.matricula || "Sin Matricula",

      Nivel: item.Alumno?.Nivel?.nombre || "Sin Nivel",
      Grado: item.Alumno?.Grado?.nombre || "Sin Grado",
      Grupo: item.Alumno?.Grupo?.nombre || "Sin Grupo",

      Materia: item.Calificaciones?.Materia?.nombre || "Sin Materia",

      Promedio_general: item.promedio_general || 0,
      Promedio_final: item.promedio_final || 0,
      Ciclo: item.ciclo || "Sin ciclo",

      Calificacion: item.Calificaciones?.calificacion || 0,
      Periodo: item.Calificaciones?.periodo || "Sin periodo",
    }));

    setCalificacionesExcel(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener Calificaciones");
  }
};

export const handleDeleteVarios = async (ids, setEvaluacion) => {
  if (ids.length == 0) {
    showAlert("error", "Selecciona las Calificaciones que deseas eliminar.");
    return;
  }
  const result = await showAlert("delete", "¿Deseas eliminar varias Calificaciones?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(ids, "evaluacion", "id_evaluacion");
  await obtenerEvaluacion(setEvaluacion); // refrescar tabla
  showAlert("success", "Calificaciones eliminadas correctamente");
};

export const generarPdfCalificacion = async (row) => {
  try {

    const response = await InstitutoDataFilter(
      `evaluacion/pdf/${row.id_alumno}?ciclo=${encodeURIComponent(row.ciclo || "")}`
    );

    if (!response || response.length === 0) {
      showAlert("error", "No se encontraron datos");
      return;
    }

    const alumno = response[0];

    await ExportarPDFCalificacion(
      `Calificaciones_${alumno.matricula}`,
      alumno,
      alumno.Evaluacions
    );

  } catch (error) {

    console.error(error);

    showAlert(
      "error",
      "Error al generar PDF"
    );

  }
};
