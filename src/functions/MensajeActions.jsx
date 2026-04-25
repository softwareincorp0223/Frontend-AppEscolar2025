import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataUpdate,
  InstitutoDataFilter,
} from "./general/DataActions";
import { mapReceptor } from "./general/Functions";

export const obtenerMensajes = async (setMensajes) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");

    const mensajesApi = await InstitutoDataFilter(
      "vista-mensajes?sid_instituto=" + sid_instituto,
    );

    const formateados = mensajesApi.map((data) => ({
      ...data,
      receptor: mapReceptor(data.receptor),
      fecha_de_envio: fechaFormateada(data?.fecha_envio, { paraUI: true }) ?? "Sin fecha",
    }));


    setMensajes(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener Tipos de Mensajes");
  }
};