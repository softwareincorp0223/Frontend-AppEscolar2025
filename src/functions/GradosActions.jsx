import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";


export const obtenerGrados = async (setGrados) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const where = encodeURIComponent(
      JSON.stringify({
        Nivel: { sid_instituto }
      })
    );

    // NO MANDAR sid_instituto extra
    const gradosApi = await InstitutoDataFilter(
      `grado?include=Nivel&where=${where}`
    );

    const formateados = gradosApi.map(g => ({
      ...g,
      nombreNivel: g.Nivel?.nombre || "Sin nivel"
    }));


    setGrados(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener grados");
  }
};



export const handleDeleteGrados = async (row, obtenerGrados) => {
  const result = await showAlert("delete", "¿Deseas eliminar este grado?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`grado/${row.id_grado}`);
  await obtenerGrados(); // refrescar tabla
  showAlert("success", "Grado eliminado correctamente");
};

export const handleSaveGrados = async (values, editingGrado, setEditingGrado, obtenerGrados) => {

  const payload = {
    id_grado: editingGrado ? editingGrado.id_grado : null,
    sid_nivel: values.nombreNivel,
    nombre: values.nombre,
    orden: 1
  };

  console.log(values);
  if (editingGrado) {
    await InstitutoDataUpdate(`grado/${editingGrado.id_grado}`, payload);
    showAlert("success", "Grado actualizado correctamente");
    setEditingGrado(null);
  } else {
    await InstitutoDataAdd("grado", payload);
    showAlert("success", "Grado agregado correctamente");
  }

  await obtenerGrados();
};

export const obtenerGradosPorNivel = async (sid_nivel, setGrados) => {
  try {
    const where = encodeURIComponent(JSON.stringify({ sid_nivel }));

    const data = await InstitutoDataFilter(`grado?where=${where}`);

    setGrados(data);
  } catch (error) {
    showAlert("error", "Error al obtener grados por nivel");
  }
};
