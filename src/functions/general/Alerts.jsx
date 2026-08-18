// src/utils/alerts.js
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatMultilineMessage = (message) => {
  const lines = String(message || "").split("\n").filter(Boolean);
  if (lines.length <= 1) return null;

  const [title, ...details] = lines;
  return `
    <div style="text-align:left; line-height:1.45;">
      <p style="margin:0 0 12px; text-align:center;">${escapeHtml(title)}</p>
      ${details.map((line) => `<div style="margin:8px 0;">${escapeHtml(line)}</div>`).join("")}
    </div>
  `;
};

export function showAlert(type, message = "") {
  switch (type) {
    case "success":
      return Swal.fire({
        icon: "success",
        title: "Listo",
        text: message || "Operacion exitosa",
        confirmButtonColor: "#0399fd",
      });

    case "error": {
      const formattedError = formatMultilineMessage(message);
      return Swal.fire({
        icon: "error",
        title: "Error",
        ...(formattedError
          ? { html: formattedError }
          : { text: message || "Ocurrio un error" }),
        confirmButtonColor: "#ef4444",
      });
    }

    case "info":
      Swal.fire({
        icon: "info",
        title: "Informacion",
        text: message || "Informacion importante",
        confirmButtonColor: "#0399fd",
      });
      break;

    case "delete":
      return Swal.fire({
        icon: "warning",
        title: "Estas seguro?",
        text: message || "Esta accion no se puede deshacer",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
      });

    case "warning":
      return Swal.fire({
        icon: "warning",
        title: "Estas seguro?",
        text: message,
        showCancelButton: true,
        confirmButtonText: "Si, continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
      });

    default:
      return Swal.fire({
        icon: "question",
        title: "Aviso",
        text: message || "Accion no definida",
        confirmButtonColor: "#0399fd",
      });
  }
}
