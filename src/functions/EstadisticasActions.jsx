import { showAlert } from "./general/Alerts";
import { InstitutoData } from "./general/DataActions";

const DEFAULT_STATS = {
  totalMensajesMes: 0,
  totalProfesores: 0,
  totalAlumnos: 0,
  totalTareasMes: 0,
  totalEventosProximos: 0,
  variacionMensajesMes: 0,
  mensajesPorDia: [],
  actividadSemanal: [],
  eventosProximos: [],
  actividadReciente: [],
};

const formatDateShort = (value) => {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "";
  return value.slice(0, 5);
};

const formatRelativeDate = (value) => {
  if (!value) return "Sin fecha";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} dias`;
  if (diffDays < 0 && diffDays >= -6) return `En ${Math.abs(diffDays)} dias`;

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const normalizarEventos = (eventos = []) =>
  eventos.map((evento) => ({
    ...evento,
    fechaCorta: formatDateShort(evento.fecha),
    horaCorta: formatTime(evento.hora),
    descripcion:
      evento.alcance && evento.fecha
        ? `${evento.alcance} - ${formatDateShort(evento.fecha)}${
            evento.hora ? ` - ${formatTime(evento.hora)}` : ""
          }`
        : "Sin detalles disponibles",
  }));

const normalizarActividad = (actividad = []) =>
  actividad.map((item) => ({
    ...item,
    time: formatRelativeDate(item.fecha),
  }));

export const obtenerEstadisticas = async (setEstadisticas) => {
  try {
    const estadisticasApi = await InstitutoData("estadisticas?sid_instituto=");

    setEstadisticas({
      ...DEFAULT_STATS,
      ...estadisticasApi,
      mensajesPorDia: estadisticasApi.mensajesPorDia || [],
      actividadSemanal: estadisticasApi.actividadSemanal || [],
      eventosProximos: normalizarEventos(estadisticasApi.eventosProximos || []),
      actividadReciente: normalizarActividad(
        estadisticasApi.actividadReciente || [],
      ),
    });
  } catch (error) {
    console.error(error);
    setEstadisticas(DEFAULT_STATS);
    showAlert("error", "Error al obtener estadisticas");
  }
};
