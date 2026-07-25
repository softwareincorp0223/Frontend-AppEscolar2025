import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";


export const obtenerGrupos = async (setGrupos) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const gruposApi = await InstitutoDataFilter(
      `vistagradogrupo?sid_instituto=${sid_instituto}`
    );

    const formateados = gruposApi.map(g => ({
      ...g,
      nombreGrado: g.nombre_grado || "Sin grado",
      nombreNivel: g.nombre_nivel || "Sin nivel"
    }));

    setGrupos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener grados");
  }
};

export const handleDeleteGrupos = async (row, obtenerGrupos) => {
  const result = await showAlert("delete", "¿Deseas eliminar este grupo?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`grupo/${row.id_grupo}`);
  await obtenerGrupos(); // refrescar tabla
  showAlert("success", "Grupo eliminado correctamente");
};

export const handleSaveGrupos = async (values, editingGrupo, setEditingGrupo, obtenerGrupos) => {

  const payload = {
    id_grupo: editingGrupo ? editingGrupo.id_grupo : null,
    sid_grado: values.Grado,
    nombre:values.nombre,
  };

  console.log(payload);
  if (editingGrupo) {
    await InstitutoDataUpdate(`grupo/${editingGrupo.id_grupo}`, payload);
    showAlert("success", "Grupo actualizado correctamente");
    setEditingGrupo(null);
  } else {
    await InstitutoDataAdd("grupo", payload);
    showAlert("success", "Grupo agregado correctamente");
  }

  await obtenerGrupos();
};

export const obtenerGruposPorGrados = async (sig_grado, setGrados) => {
  try {
    const data = await InstitutoDataFilter(`grupo?sid_grado=${sig_grado}`);

    setGrados(data);
  } catch (error) {
    showAlert("error", "Error al obtener grados por nivel");
  }
};
