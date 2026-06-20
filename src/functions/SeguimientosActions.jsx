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

  const fecha = fechaFormateada(new Date().toISOString().split("T")[0]);

  const result = await showAlert("delete", "¿Deseas eliminar este Seguimiento?");
  if (!result.isConfirmed) return;

  const payload = {
    eliminado: "1",
    fecha_eliminacion: fecha,
  };

  await InstitutoDataUpdate(
    `seguimiento/${row.id_seguimiento}`,
    payload
  );
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
  if (ids.length === 0) {
    showAlert("error", "Selecciona los seguimientos que deseas eliminar.");
    return;
  }

  const result = await showAlert(
    "delete",
    `¿Deseas eliminar ${ids.length} seguimientos?`
  );

  if (!result.isConfirmed) return;

  const fecha = fechaFormateada(
    new Date().toISOString().split("T")[0]
  );

  await InstitutoDataUpdate("seguimiento", {
    ids,
    idField: "id_seguimiento",
    eliminado: "1",
    fecha_eliminacion: fecha,
  });

  await obtenerSeguimientos(setSeguimientos);

  showAlert("success", "Seguimientos eliminados correctamente");
};