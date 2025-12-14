import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerAsistencias = async (setUsuarios) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const asistenciasApi = await InstitutoDataFilter(
      "vistaasistencia?sid_instituto=" + sid_instituto
    );

    const formateados = asistenciasApi.map((a) => ({
      ...a,
      estudiante: a.nombre_alumno + ' ' + a.apellido_alumno,
      nivel: a.nombre_nivel,
      grado: a.nombre_grado,
      grupo: a.nombre_grupo,
      fecha_y_hora: a.fecha_ingreso,
      tipo: a.tipo,
      registrado_por: a.nombre_usuario + ' ' + a.apellido_usuario,
    }));

    setUsuarios(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};

