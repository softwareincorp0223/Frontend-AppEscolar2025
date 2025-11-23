// src/utils/auth.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth/login"; // <-- ajusta tu endpoint real

// Configurar axios globalmente
axios.defaults.withCredentials = true; // si usas cookies
axios.defaults.headers.common["Accept"] = "application/json";

// Iniciar sesión
export async function login(correo, contrasena) {

  const tipo = 'usuario';

  try {
    const res = await axios.post(
      API_URL,
      { correo, contrasena, tipo},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Aquí asumimos que la respuesta trae user + token
    const { usuario, token } = res.data;

    localStorage.setItem("user", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    localStorage.setItem("sid_instituto", usuario.sid_instituto);

    return res.data;
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

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/src/pages/login/index.html";
}
