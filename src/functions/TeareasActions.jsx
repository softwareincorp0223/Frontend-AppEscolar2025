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

    console.log(tareasApi);

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
      nivel: a.nombre_nivel || "Sin nivel",
      grado: a.nombre_grado || "Sin grado",
      grupo: a.nombre_grupo || "Sin grupo",
      creada: fechaFormateada(a.fecha_creacion, { paraUI: true }) || "Sin fecha",
      profesor: a.nombre_profesor + " " + a.apellido_profesor,
    }));

    setTareas(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asistencias");
  }
};

export const handleSaveTarea = async (values, editingTarea = null) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    // =========================
    // Datos tarea
    // =========================

    const payload = {
      id_tareas: editingTarea ? editingTarea.id_tarea : "",
      sid_grupo: values.grupo_tarea,
      sid_materia: values.materia_tarea,
      instrucciones_tarea: values.instrucciones,
      sid_instituto,
      fecha_creacion: new Date().toISOString(),
    };

    /*
    // ======================================
    // CUANDO SE SUBAN ARCHIVOS
    // ======================================

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    */

    // =========================
    // GUARDAR TAREA
    // =========================

    if (editingTarea) {

      await InstitutoDataUpdate(
        `tareas/${editingTarea.id_tarea}`,
        payload
        // formData
      );

      showAlert("success", "Tarea actualizada correctamente");

    } else {

      const response = await InstitutoDataAdd(
        "tareas",
        payload
        // formData
      );

      const sid_tarea = response.id_tarea;

      // =========================
      // GUARDAR URLS
      // =========================

      /*
      if (values.urls && values.urls.length > 0) {

        for (const url of values.urls) {

          if (!url) continue;

          await InstitutoDataAdd("url_tarea", {
            sid_tarea,
            url,
          });

        }

      }
      */

      // =========================
      // GUARDAR ARCHIVOS
      // =========================

      /*
      if (values.archivos && values.archivos.length > 0) {

        for (const archivo of values.archivos) {

          if (!archivo) continue;

          const archivoForm = new FormData();

          archivoForm.append("sid_tarea", sid_tarea);
          archivoForm.append("archivo", archivo);

          await InstitutoDataAdd(
            "archivo_tarea",
            archivoForm
          );

        }

      }
      */

      showAlert("success", "Tarea agregada correctamente");
    }

  } catch (error) {

    console.error(error);

    showAlert("error", "Error al guardar la tarea");

  }
};