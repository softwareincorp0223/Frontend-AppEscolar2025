import { showAlert } from "./general/Alerts";
import {
  InstitutoDataAdd,
  InstitutoData,
  InstitutoDataUpdate,
} from "./general/DataActions";
import { fechaFormateada } from "./general/Functions";

export const obtenerRegistroMensajes = async (setRegistroMensajes) => {
  try {
    const registroMensajes = await InstitutoData(
      "vista-registro-mensajes?sid_instituto="
    );

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
