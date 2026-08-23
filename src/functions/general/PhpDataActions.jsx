import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost/apiAppEscolarv2/"
    : "/apiAppEscolarv2/";

// Config global
axios.defaults.headers.common["Accept"] = "application/json";

/**
 * Función GENERAL para cualquier acción en PHP
 */
export async function phpRequest(endpoint, accion, data = {}) {
  try {
    const res = await axios.post(
      API_URL + endpoint,
      {
        accion,
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.msg || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con PHP (CORS o servidor apagado)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}