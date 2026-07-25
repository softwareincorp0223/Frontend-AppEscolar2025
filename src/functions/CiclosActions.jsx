import { showAlert } from "./general/Alerts";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataFilter,
  InstitutoDataUpdate,
} from "./general/DataActions";

export const obtenerCiclos = async (setCiclos) => {
  try {

    const ciclosApi = await InstitutoData("ciclo?&sid_instituto=");
    setCiclos(ciclosApi.sort((a, b) => (a.orden || 0) - (b.orden || 0)));
  } catch (error) {
    showAlert("error", "Error al obtener ciclos");
  }
};

export const obtenerEstadoCiclos = async (setEstado) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");
    const estado = await InstitutoDataFilter(`ciclo/estado/${sid_instituto}`);
    setEstado(estado);
  } catch (error) {
    showAlert("error", "Error al obtener estado de ciclos");
  }
};


export const handleDelete = async (row, obtenerCiclos) => {

  console.log(obtenerCiclos);
  const result = await showAlert("delete", "¿Deseas eliminar este ciclo?");
  if (!result.isConfirmed) return;
  try {
    await InstitutoDataDelete(`ciclo/${row.id_ciclo}`);
    await obtenerCiclos(); // refrescar tabla
    showAlert("success", "Ciclo eliminado correctamente");
  } catch (error) {
    showAlert("error", error.message || "Error al eliminar ciclo");
  }
};

export const handleSave = async (values, editingCiclo, setEditingCiclo, obtenerCiclos) => {
  const sid_instituto = localStorage.getItem("sid_instituto");

  const payload = {
    id_ciclo: editingCiclo ? editingCiclo.id_ciclo : null,
    nombre: values.nombre,
    sid_instituto,
    ciclo_cerrado: 0,
  };

  console.log("Payload enviado:", payload);

  if (editingCiclo) {
    await InstitutoDataUpdate(`ciclo/${editingCiclo.id_ciclo}`, payload);
    showAlert("success", "Ciclo actualizado correctamente");
    setEditingCiclo(null);
  } else {
    await InstitutoDataAdd("ciclo", payload);
    showAlert("success", "Ciclo agregado correctamente");
  }

  await obtenerCiclos();
};

export const handleRegularizarEscuela = async (obtenerCiclos) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const result = await showAlert(
    "warning",
    "Este proceso registrara los alumnos actuales en el ciclo abierto. Solo debe hacerse una vez."
  );
  if (!result.isConfirmed) return;

  try {
    const respuesta = await InstitutoDataAdd("ciclo/regularizar", { sid_instituto });
    showAlert(
      "success",
      `${respuesta.message}. Regularizados: ${respuesta.total_regularizados}`
    );
    await obtenerCiclos();
  } catch (error) {
    showAlert("error", error.message || "Error al regularizar escuela");
  }
};

export const ejecutarPasarCiclo = async (obtenerCiclos, overrides = []) => {
  const sid_instituto = localStorage.getItem("sid_instituto");

  try {
    const respuesta = await InstitutoDataAdd("ciclo/pasar", { sid_instituto, overrides });
    showAlert(
      "success",
      `${respuesta.message}. Promovidos: ${respuesta.total_promovidos}. Egresados: ${respuesta.total_egresados}`
    );
    await obtenerCiclos();
    return respuesta;
  } catch (error) {
    showAlert("error", error.message || "Error al pasar ciclo");
    throw error;
  }
};

export const handlePasarCiclo = async (obtenerCiclos, onFaltantes) => {
  const sid_instituto = localStorage.getItem("sid_instituto");
  const result = await showAlert(
    "warning",
    "Este proceso cerrara el ciclo actual y movera los alumnos al siguiente ciclo abierto."
  );
  if (!result.isConfirmed) return;

  try {
    const validacion = await InstitutoDataAdd("ciclo/validar-paso", { sid_instituto });

    if (validacion.faltantes?.length > 0) {
      onFaltantes?.(validacion.faltantes);
      return;
    }

    await ejecutarPasarCiclo(obtenerCiclos);
  } catch (error) {
    showAlert("error", error.message || "Error al validar paso de ciclo");
  }
};
