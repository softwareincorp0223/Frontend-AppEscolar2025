import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoDataFilter,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerSeguimientos = async (setSeguimientos) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const where = encodeURIComponent(
      JSON.stringify({
        eliminado: 0,
        Alumno: { sid_instituto }
      })
    );

    // NO MANDAR sid_instituto extra
    const seguimientosApi = await InstitutoDataFilter(
      `seguimiento?include=Alumno&where=${where}`
    );

    const formateados = seguimientosApi.map(g => ({
      ...g,
      nombreAlumno: g.Alumno?.nombre + " " + g.Alumno?.apellido || "Sin alumno"
    }));


    setSeguimientos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener alumnos");
  }
};

export const handleDelete = async (row, obtenerSeguimientos) => {

  console.log(obtenerSeguimientos);
  const result = await showAlert("delete", "¿Deseas eliminar este Seguimiento?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`seguimiento/${row.id_seguimiento}`);
  await obtenerSeguimientos(); // refrescar tabla
  showAlert("success", "Seguimiento eliminado correctamente");
};


export const obtenerSeguimientosEliminados = async (setSeguimientos) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const where = encodeURIComponent(
      JSON.stringify({
        Alumno: { sid_instituto },
        eliminado: 1,
      })
    );

    // NO MANDAR sid_instituto extra
    const seguimientosApi = await InstitutoDataFilter(
      `seguimiento?include=Alumno&where=${where}`
    );

    const formateados = seguimientosApi.map(g => ({
      ...g,
      nombreAlumno: g.Alumno?.nombre + " " + g.Alumno?.apellido || "Sin alumno"
    }));


    setSeguimientos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener alumnos");
  }
};

export const handleDeleteVarios = async (ids, setSeguimientos) => {
  if (ids.length == 0) {
    showAlert("error", "Selecciona los seguimientos que deseas eliminar.");
    return;
  }
  const result = await showAlert("delete", "¿Deseas eliminar varios Seguimientos?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(ids, "padre", "id_padre");
  await obtenerSeguimientos(setSeguimientos); // refrescar tabla
  showAlert("success", "Seguimientos eliminados correctamente");
};