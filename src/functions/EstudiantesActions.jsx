import { showAlert } from "./general/Alerts";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataFilter,
  InstitutoDataUpdate,
} from "./general/DataActions";
import { generarCodigoQR } from "./general/Functions";
import { phpRequest } from "./general/PhpDataActions";

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

export const handleSaveAlumnos = async (values, editing, setEditing, obtenerAlumnos) => {

  const sid_instituto = localStorage.getItem("sid_instituto");

  const payload = {
    id_alumno: editing ? editing.id_alumno : null,
    nombre: values.nombre,
    apellido: values.apellido,
    matricula: values.matricula,
    sexo: values.Sexo,
    codigo_qr: editing ? editing.codigo_qr : generarCodigoQR(),
    sid_nivel: values.Nivel,
    sid_grado: values.Grado,
    sid_grupo: values.Grupo,
    sid_padre: values.Padre,
    foto: values.Foto,
    nombre_contacto: "Sin datos",
    telefono_contacto: "Sin datos",
    alergias: "Sin datos",
    sid_instituto,
  };

  if (editing) {
    await InstitutoDataUpdate(`alumno/${editing.id_alumno}`, payload);
    showAlert("success", "Alumno actualizado correctamente");
    setEditing(null);
  } else {
    const res = await InstitutoDataAdd("alumno", payload);
    await phpRequest("alumno.php", "modificar", {
      id_alumno: res.id_alumno,
    });
    showAlert("success", "Alumno agregado correctamente");
  }

  await obtenerAlumnos();
};

export const obtenerAlumnosPadres = async (id_padre, setAlumnos) => {
  try {
    const alumnosPadreApi = await InstitutoDataFilter("alumno?include=Nivel,Grado,Grupo&sid_padre=" + id_padre);
    const padreQR = await phpRequest("padre.php", "consultar", { id_padre: id_padre });
    
    const formateados = alumnosPadreApi.map((data) => ({
      ...data,
      nivel: data.Nivel?.nombre || "Sin Nivel",
      grado: data.Grado?.nombre || "Sin Grado",
      grupo: data.Grupo?.nombre || "Sin Grado",
      padreQR: padreQR?.codigo_qr || "Sin QR",
    }));
    setAlumnos(formateados);

  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const handleDeleteVarios = async (ids, setEstudiantes) => {
  console.log(ids);
  
  if (ids.length == 0) {
    showAlert("error", "Selecciona los estudiantes que deseas eliminar.");
    return;
  }
  const result = await showAlert("delete", "¿Deseas eliminar varios estudiantes?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(ids, "alumno", "id_alumno");
  await obtenerAlumnos(setEstudiantes); // refrescar tabla
  showAlert("success", "Estudiante eliminado correctamente");
};

export const handleDelete = async (row, setEstudiantes) => {
  const result = await showAlert("delete", "¿Deseas eliminar este estudiante?");

  console.log(row)
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`alumno/${row.id_alumno}`);
  await obtenerAlumnos(setEstudiantes); // refrescar tabla
  showAlert("success", "Estudiante eliminado correctamente");
};
