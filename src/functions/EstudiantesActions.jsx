import { showAlert } from "./general/Alerts";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerAlumnos = async (setAlumnos) => {
  try {
    const alumnosApi = await InstitutoData("alumno?include=Nivel,Grado,Grupo&sid_instituto=");
    const formateados = alumnosApi.map((data) => ({
      ...data,
      Nivel: data.Nivel?.nombre || "Sin Nivel",
      Grado: data.Grado?.nombre || "Sin Grado",
      Grupo: data.Grupo?.nombre || "Sin Grado",
    }));
    setAlumnos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};