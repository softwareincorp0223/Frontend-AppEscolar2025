import axios from "axios";

const API_URL = "http://localhost:4000/api/"; // <-- ajusta tu endpoint real

// Configurar axios globalmente
axios.defaults.withCredentials = true; // si usas cookies
axios.defaults.headers.common["Accept"] = "application/json";
const sid_instituto = localStorage.getItem("sid_instituto");

//leer datos de API por instituto
export async function InstitutoData(consulta) {
console.log(API_URL + consulta + sid_instituto);

  try {
    const res = await axios.get(
      API_URL + consulta + sid_instituto,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Aquí asumimos que la respuesta trae user + token
    const data =  res.data;

    return data;
  } catch (error) {
    // Detectar si es un error de CORS o de credenciales
    if (error.response) {
      throw new Error(error.response.data?.message || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}

export async function InstitutoDataFilter(consulta) {
  try {
    const res = await axios.get(API_URL + consulta, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}

//agregar datos de API por instituto
export async function InstitutoDataAdd(endpoint, data) {
  try {
    const res = await axios.post(
      API_URL + endpoint,
      data, // los datos que quieres enviar
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Devolvemos la respuesta del servidor
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}

export async function InstitutoDataUpdate(endpoint, data) {
  try {
    const res = await axios.put(
      API_URL + endpoint,
      data, // los datos que quieres enviar
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Devolvemos la respuesta del servidor
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}

export async function InstitutoDataDelete(endpointOrIds, endpoint, id_field) {
  try {
    let url = API_URL;
    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Caso 1: eliminar varios (array de IDs)
    if (Array.isArray(endpointOrIds)) {
      url += endpoint; 
      options.data = { ids: endpointOrIds, idField: id_field };
    }
    // Caso 2: eliminar uno solo (endpoint string)
    else if (typeof endpointOrIds === "string") {
      url += endpointOrIds;
    } else {
      throw new Error(
        "Parámetro inválido: se esperaba un string o un array de IDs"
      );
    }

    const res = await axios(url, options);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexión con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}
