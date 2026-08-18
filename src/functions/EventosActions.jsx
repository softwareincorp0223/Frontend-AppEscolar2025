import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";

export const obtenerEventos = async (setEventos) => {
  try {
    const eventoApi = await InstitutoData("evento?&sid_instituto=");

    setEventos(eventoApi);
  } catch (error) {
    showAlert("error", "Error al obtener Eventos");
  }
};


export const handleDelete = async (row, obtenerEventos) => {

  console.log("desde delete", row);
  const result = await showAlert("delete", "¿Deseas eliminar este Evento?");
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`evento/${row.id_evento}`);
  await obtenerEventos(); // refrescar tabla
  showAlert("success", "Evento eliminado correctamente");
};

export const handleSave = async (values, editingEvento, setEditingEvento, obtenerEventos, resetFormulario) => {
  const sid_instituto = localStorage.getItem("sid_instituto");

  const fechaFormateada = values.fecha_evento.split("T")[0];

  const payload = {
    id_evento: editingEvento ? editingEvento.id_evento : null,
    nombre: values.nombre_evento,
    fecha: fechaFormateada,
    hora: values.hora_evento,
    todos: values.toda_escuela ? 1 : 0,
    nivel: values.Nivel,
    grado: values.Grado,
    grupo: values.Grupo,
    sid_instituto
  };

  console.log("Payload enviado:", payload);

  const response = await InstitutoDataAdd("evento", payload);
  showAlert("success", "Evento agregado correctamente");

  const sid_evento = response?.id_evento || response?.id || payload.id_evento;

  if (!editingEvento && sid_evento) {
    try {
      await InstitutoDataAdd(`mobile/notificaciones/calendario/${sid_evento}/enviar`, {});
    } catch (error) {
      console.error("No se pudo enviar la notificacion de calendario", error);
    }
  }

  if (editingEvento) {
    await InstitutoDataUpdate(`evento/${editingEvento.id_evento}`, payload);
    showAlert("success", "Evento actualizado correctamente");
    setEditingEvento(null);
  }

  await obtenerEventos();
  if (resetFormulario) {
    resetFormulario();
  }
};


