import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

const enviarNotificacionSeguimientoIndividual = async (alumno) => {
  if (!alumno?.id_seguimiento) return;

  const sid_alumnos = alumno.sid_alumno ? [alumno.sid_alumno] : [];

  try {
    await InstitutoDataAdd(
      `mobile/notificaciones/seguimientos/${alumno.id_seguimiento}/enviar`,
      { sid_alumnos }
    );
  } catch (error) {
    console.error("No se pudo enviar la notificacion de seguimiento", error);
  }
};

export const obtenerAtributoSeguimientos = async (setAtributoSeguimiento, sid_seguimiento) => {
  try {

    const atributoSeguimientoApi = await InstitutoDataFilter(
      `asignar_atributo?include=Atributo&sid_seguimiento=${sid_seguimiento}`
    );

    setAtributoSeguimiento(atributoSeguimientoApi);
  } catch (error) {
    showAlert("error", "Error al obtener Atributos del Alumno");
  }
};

export const handleSaveAsignarAtributo = async (values, alumno, obtenerAtributoSeguimientos) => {

  const fecha = fechaFormateada(new Date());

  const user = JSON.parse(localStorage.getItem("user"));
  const sid_usuario = user.id;

  // console.log(alumno);
  const payload = {
    id_asignar_atributo: null,
    sid_atributo: values.sid_atributo,
    sid_seguimiento: alumno.id_seguimiento,
    valor_atributo: values.nombre,
    fecha_registro: fecha,
    sid_usuario,
  };

  console.log("Payload enviado:", payload);

  await InstitutoDataAdd("asignar_atributo", payload);
  await enviarNotificacionSeguimientoIndividual(alumno);

  showAlert("success", "Atributo Agregado Correctamente");

  await obtenerAtributoSeguimientos(alumno.id_seguimiento);
};

export const handDeleteAsignarAtributo = async (row, obtenerAtributoSeguimientos) => {

  console.log(row);
  const result = await showAlert("delete", "¿Deseas eliminar este Atributo?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`asignar_atributo/${row.id_asignar_atributo}`);
  await obtenerAtributoSeguimientos(); // refrescar tabla
  showAlert("success", "Atributo eliminado correctamente");

}

export const obtenerAsignarAtributosExcel = async (setAsignarAtributoExcel) => {
  try {
    const data = await InstitutoData(
      "asignar_atributo/excel/"
    );

    const formateados = data.map((item) => ({
      Nombre: item.Seguimiento?.Alumno?.nombre || "",
      Apellido: item.Seguimiento?.Alumno?.apellido || "",
      Matricula: item.Seguimiento?.Alumno?.matricula || "",

      Nivel: item.Seguimiento?.Alumno?.Nivel?.nombre || "",
      Grado: item.Seguimiento?.Alumno?.Grado?.nombre || "",
      Grupo: item.Seguimiento?.Alumno?.Grupo?.nombre || "",

      Observacion: item.Seguimiento?.observacion || "",
      Leido: item.Seguimiento?.leido || "",

      FechaRegistro: item.fecha_registro || "",
      FechaEliminacion: item.Seguimiento?.fecha_eliminacion || "",
      Eliminado: item.Seguimiento.eliminado == 0
      ? "Sin Eliminar"
      : item.Seguimiento.eliminado == 1
        ? "Eliminado"
        : "",

      Atributo: item.Atributo?.nombre || "",
      ValorAtributo: item.valor_atributo || ""
    }));

    setAsignarAtributoExcel(formateados);
  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener asignar Atributo");
  }
};
