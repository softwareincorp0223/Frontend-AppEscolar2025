import { showAlert } from "./general/Alerts";
import {
  InstitutoDataAdd,
  InstitutoData,
  InstitutoDataUpdate,
  InstitutoDataFilter
} from "./general/DataActions";
import { fechaFormateada } from "./general/Functions";

export const obtenerRegistroMensajes = async (setRegistroMensajes) => {
  try {

    const sid_instituto = localStorage.getItem("sid_instituto");

    const registroMensajes = await InstitutoDataFilter(
      "vista-registro-mensajes?sid_instituto=" + sid_instituto + "&eliminado=si"
    );
    console.log(registroMensajes);

    const formateados = registroMensajes.map((data) => ({
      ...data,
      emisor:
        `${data?.nombre_usuario ?? ""} ${
          data?.apellido_usuario ?? ""
        }`.trim() || "Sin emisor",

      fecha_de_envio: fechaFormateada(data?.fecha_envio) ?? "Sin fecha",
      fecha_de_eliminacion:
        fechaFormateada(data?.fecha_eliminacion) ?? "Sin fecha",
    }));

    setRegistroMensajes(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener Tipos de Mensajes");
  }
};
