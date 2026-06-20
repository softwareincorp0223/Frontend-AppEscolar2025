import { showAlert } from "./general/Alerts";
import { InstitutoData } from "./general/DataActions";

export const obtenerEstadisticas = async (setEstadisticas) => {
  try {
    const estadisticasApi = await InstitutoData(
      "estadisticas?sid_instituto="
    );

    setEstadisticas({
      totalMensajesMes: estadisticasApi.totalMensajesMes || 0,
      mensajesPorDia: estadisticasApi.mensajesPorDia || [],
    });

  } catch (error) {
    console.error(error);
    showAlert("error", "Error al obtener estadísticas");
  }
};