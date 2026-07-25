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
      fecha_y_hora: fechaFormateada(a.fecha_ingreso, { paraUI: true }),
      tipo: a.tipo,
      registrado_por: a.nombre_usuario + ' ' + a.apellido_usuario,
    }));

    setUsuarios(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};

export const obtenerAsistenciasExcel = async (setAsistenciasExcel) => {
  try {
    const asistenciasApi = await InstitutoData("vistaasistencia/excel/");

    const formateados = asistenciasApi.map((a) => ({
      Nombre: `${a.nombre_alumno || ""} ${a.apellido_alumno || ""}`.trim(),
      Nivel: a.nombre_nivel || "",
      Grado: a.nombre_grado || "",
      Grupo: a.nombre_grupo || "",
      FechaHora: fechaFormateada(a.fecha_ingreso, { paraUI: true }) || "",
      Tipo: a.tipo || "",
      RegistradoPor: `${a.nombre_usuario || ""} ${a.apellido_usuario || ""}`.trim(),
    }));

    setAsistenciasExcel(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias para Excel");
  }
};
