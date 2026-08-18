// src/utils/auth.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth/login"; // <-- ajusta tu endpoint real
const AUTH_URL = "http://localhost:4000/api/auth";

// Configurar axios globalmente
axios.defaults.withCredentials = true; // si usas cookies
axios.defaults.headers.common["Accept"] = "application/json";

export function setAuthHeader(token = localStorage.getItem("token")) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

setAuthHeader();

// Iniciar sesion
export async function login(correo, contrasena) {
  const tipo = "usuario";

  try {
    const res = await axios.post(
      API_URL,
      { correo, contrasena, tipo },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { usuario, token } = res.data;

    localStorage.setItem("user", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    localStorage.setItem("sid_instituto", usuario.sid_instituto);
    setAuthHeader(token);

    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      throw new Error("Correo o contrasena incorrectos");
    }

    throw new Error("No se pudo iniciar sesion");
  }
}

export async function resetPassword(correo) {
  try {
    const res = await axios.post(
      `${AUTH_URL}/restaurar-contrasena`,
      { correo },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || "Error en el servidor");
    } else if (error.request) {
      throw new Error("Error de conexion con el servidor (CORS o red)");
    } else {
      throw new Error("Error desconocido");
    }
  }
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export async function refreshUserPermissions() {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user || user.tipo === "admin") return user;

  setAuthHeader(token);

  try {
    const res = await axios.get(`${AUTH_URL}/me/permissions`);
    const updatedUser = {
      ...user,
      sid_rol: res.data.sid_rol,
      privilegios: res.data.privilegios || [],
      permisos_configurados: !!res.data.permisos_configurados,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return user;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("sid_instituto");
  setAuthHeader(null);
  window.location.href = "/src/pages/login/index.html";
}
