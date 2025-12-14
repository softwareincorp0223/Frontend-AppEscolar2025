import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerTareas = async (setTareas) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const tareasApi = await InstitutoDataFilter(
      "vistatareas?sid_instituto=" + sid_instituto
    );

    /*
    "id_tareas": "alem9",
    "sid_instituto": "eg8sz",
    "sid_grado": "bdmyo",
    "sid_grupo": "qufxb",
    "nombre_profesor": "ARIANY",
    "apellido_profesor": "MIS OXTE",
    "materia": "ESPAÑOL",
    "nombre_nivel": "PREESCOLAR MERIDA",
    "nombre_grado": "MATERNAL",
    "nombre_grupo": "A",
    "instrucciones_tarea": "<p>prueba asignar materia</p>",
    "fecha_creacion": "2024-09-22T14:16:26.000Z"

    */
    const formateados = tareasApi.map((a) => ({
      ...a,
      nivel: a.nombre_nivel,
      grado: a.nombre_grado,
      grupo: a.nombre_grupo,
      creada: a.fecha_creacion,
      profesor: a.nombre_profesor + " " + a.apellido_profesor,
    }));

    setTareas(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};
