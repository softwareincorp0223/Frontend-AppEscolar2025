import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

export const obtenerExtracurricular = async (setExtracurriculares) => {
  try {
    const extracurricularesApi = await InstitutoData("extracurricular?&sid_instituto=");

    setExtracurriculares(extracurricularesApi);
  } catch (error) {
    showAlert("error", "Error al obtener ciclos");
  }
};


export const handleDelete = async (row, obtenerExtracurricular) => {

  console.log(obtenerExtracurricular);
  const result = await showAlert("delete", "¿Deseas eliminar este Extracurricular?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`extracurricular/${row.id_extracurricular}`);
  await obtenerExtracurricular(); // refrescar tabla
  showAlert("success", "Extracurricular eliminado correctamente");
};

export const handleSave = async (values, editingExtracurricular, setEditingExtracurricular, obtenerExtracurricular) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const payload = {
    id_extracurricular: editingExtracurricular ? editingExtracurricular.id_extracurricular : null,
    nombre: values.nombre,
    sid_instituto
  };

   console.log("Payload enviado:", payload);

  if (editingExtracurricular) {
    await InstitutoDataUpdate(`extracurricular/${editingExtracurricular.id_extracurricular}`, payload);
    showAlert("success", "Extracurricular actualizado correctamente");
    setEditingExtracurricular(null);
  } else {
    await InstitutoDataAdd("extracurricular", payload);
    showAlert("success", "Extracurricular agregado correctamente");
  }

  await obtenerExtracurricular();
};

export const handleSaveExtracurricularAlumno = async (values, alumno, obtenerAlumnosExtracurricular) => {

  const fecha = fechaFormateada();

  const payload = {
    id_alumno_extracurricular: null,
    sid_extracurricular: alumno.id_extracurricular,
    sid_alumno: values.sid_alumno,
    fecha_ingreso: fecha,
  };

  console.log("Payload enviado:", payload);

  await InstitutoDataAdd("alumno_extracurricular", payload);

  showAlert("success", "Alumno con Extracurricular agregado correctamente");

  await obtenerAlumnosExtracurricular(alumno.id_extracurricular);
};


export const obtenerAlumnosExtracurricular = async (setAlumnosExtracurricular, sid_extracurricular) => {
  try {

    const alumnoExtracurricularApi = await InstitutoDataFilter(
      `alumno_extracurricular?include=Alumno&sid_extracurricular=${sid_extracurricular}`
    );

    setAlumnosExtracurricular(alumnoExtracurricularApi);
  } catch (error) {
    showAlert("error", "Error al obtener Alumnos Extracurricular");
  }
};

export const handleDeleteAlumnoExtracurricular = async (row, obtenerAlumnosExtracurricular) => {

  console.log(obtenerAlumnosExtracurricular);
  const result = await showAlert("delete", "¿Deseas eliminar este Alumno?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`alumno_extracurricular/${row.id_alumno_extracurricular}`);
  await obtenerAlumnosExtracurricular(); // refrescar tabla
  showAlert("success", "Alumno eliminado correctamente");
};