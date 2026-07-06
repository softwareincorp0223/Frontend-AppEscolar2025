import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

export const obtenerMaterias = async (setMaterias) => {
  try {
    const materiasApi = await InstitutoData("materia?&sid_instituto=");
    const formateados = materiasApi.map((u) => ({
      ...u,
      Rol: u.Rol?.nombre || "Sin rol",
    }));
    setMaterias(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener materias");
  }
};

export const obtenerMateriasAsignadas = async (setMateriasAsignadas) => {
  try {
    const materiasAsignadasApi = await InstitutoData(
      "vista-asignar-materias?&sid_instituto=",
    );

    const formateados = materiasAsignadasApi.map((u) => ({
      ...u,
      nivelGradoGrupo: `${u.nombre_nivel} - ${u.nombre_grado} - ${u.nombre_grupo}`,
      profesor: `${u.nombre_profesor} ${u.apellido_profesor}`,
      creacion: u.fecha_creacion
        ? fechaFormateada(u.fecha_creacion, { paraUI: true })
        : "Sin fecha",
    }));

    setMateriasAsignadas(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener materias asignadas");
  }
};

export const handleDelete = async (row, obtenerMaterias) => {
  console.log(obtenerMaterias);
  const result = await showAlert("delete", "¿Deseas eliminar esta Materia?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`materia/${row.id_materia}`);
  await obtenerMaterias(); // refrescar tabla
  showAlert("success", "Materia eliminada correctamente");
};

export const handleDeleteAsignacion = async (row, obtenerMateriasAsignadas) => {
  const result = await showAlert(
    "delete",
    "¿Deseas eliminar esta Asignación de Materia?",
  );
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`asignar_materia/${row.id_asignar_materia}`);
  await obtenerMateriasAsignadas(); // refrescar tabla
  showAlert("success", "Asignación de materia eliminada correctamente");
};

export const handleSave = async (
  values,
  editingMateria,
  setEditingMateria,
  obtenerMaterias,
) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();

  const payload = {
    id_materia: editingMateria ? editingMateria.id_materia : null,
    sid_grado: "0",
    nombre: values.nombre,
    sid_instituto,
  };

  if (editingMateria) {
    await InstitutoDataUpdate(`materia/${editingMateria.id_materia}`, payload);
    showAlert("success", "Materia actualizada correctamente");
    setEditingMateria(null);
  } else {
    await InstitutoDataAdd("materia", payload);
    showAlert("success", "Materia agregada correctamente");
  }

  await obtenerMaterias();
};

export const obtenerMateriasGrupo = async (
  id_nivel,
  id_grado,
  id_grupo,
  setMateriaGrupo,
) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const materiaApi = await InstitutoDataFilter(
      `asignar_materia/consulta-select?sid_instituto=${sid_instituto}&id_nivel=${id_nivel}&id_grado=${id_grado}&id_grupo=${id_grupo}`,
    );
    console.log(materiaApi);

    setMateriaGrupo(materiaApi);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener materias");
  }
};

export const handleSaveAsignacion = async (
  values,
  editingAsignarMaterias,
  setEditingAsignarMaterias,
  obtenerMateriasAsignadas,
) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const fecha = fechaFormateada();
  console.log("Valores del formulario:", values);

  const payload = {
    id_asignar_materia: editingAsignarMaterias
      ? editingAsignarMaterias.id_asignar_materia
      : null,
    sid_materia: values.materia,
    sid_profesor: values.profesor,
    sid_nivel: values.Nivel,
    sid_grado: values.Grado,
    sid_grupo: values.Grupo,
    sid_usuario: sid_instituto,
    fecha_creacion: Date.now(),
  };

  if (editingAsignarMaterias) {
    await InstitutoDataUpdate(
      `asignar_materia/${editingAsignarMaterias.id_asignar_materia}`,
      payload,
    );
    showAlert("success", "Materia actualizada correctamente");
    setEditingAsignarMaterias(null);
  } else {
    await InstitutoDataAdd("asignar_materia", payload);
    showAlert("success", "Materia agregada correctamente");
  }

  await obtenerMateriasAsignadas();
};

export const obtenerDetalleAsignacion = async (
  id,
  setEditingAsignarMaterias,
) => {
  try {
    console.log("Materias editingAsignaMaterias:", id);

    const res = await InstitutoDataFilter(`asignar_materia/${id}`);

    setEditingAsignarMaterias(res);

    console.log("Detalle:", res);

    // aquí puedes guardar en estado si quieres
    // setDetalle(data);
  } catch (error) {
    console.error(error);
  }
};
