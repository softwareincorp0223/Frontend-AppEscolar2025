// src/components/TableButtons.jsx
import React from "react";

/*
//Modo de uso

headerButtons={(row) => (
  <TableButtons
    row={row}
    actions={[
      "delete", // predefinido
      "excel",  // predefinido
      "pdf",    // predefinido
      {
        label: "Descargar",
        icon: "download",
        className: "btn-outline-warning",
        onClick: (row) => console.log("Descargar mensaje:", row),
      },
    ]}
    onActions={tableHandlers} // si también usas funciones globales
  />
)}

*/

export default function TableButtons({ actions = [], row, onActions = {} }) {
  // Botones predefinidos (sin lógica interna fija)
  const predefined = {
    excel: {
      label: "Exportar Excel",
      icon: "description",
      className: "btn-outline-success",
      key: "excel",
    },
    delete: {
      label: "Eliminar Seleccionados",
      icon: "delete",
      className: "btn-outline-danger",
      key: "delete",
    },
    qr_code: {
      label: "Descargar QRs",
      icon: "qr_code",
      className: "btn-outline-dark",
      key: "qr_code",
    },
    pdf: {
      label: "Exportar PDF",
      icon: "picture_as_pdf",
      className: "btn-outline-primary",
      key: "pdf",
    },
    datos: {
      label: "Subir Datos",
      icon: "filter_alt",
      className: "btn-outline-secondary",
      key: "datos",
    },
    ciclo: {
      label: "Pasar Ciclo",
      icon: "cached",
      className: "btn-outline-primary",
      key: "ciclo",
    },
    regularizar: {
      label: "Regularizar Escuela",
      icon: "fact_check",
      className: "btn-outline-success",
      key: "regularizar",
    }
  };

  return (
    <>
      {actions.map((action, idx) => {
        let btn;

        // 🔹 Caso 1: string → usa predefinido
        if (typeof action === "string" && predefined[action]) {
          btn = predefined[action];
        }

        // 🔹 Caso 2: objeto → personalizado
        if (typeof action === "object") {
          btn = {
            label: action.label,
            icon: action.icon,
            className: action.className || "btn-outline-secondary",
            key: action.key || action.label,
          };
        }

        if (!btn) return null;

        // 🔹 Busca si hay handler en onActions
        const handler = onActions[btn.key] || action.onClick || (() => {});

        return (
          <button
            key={idx}
            className={`btn btn-sm ${btn.className} me-2`}
            onClick={() => handler(row)}
          >
            {btn.icon && (
              <span
                className="material-icons align-middle"
                style={{ fontSize: "1rem" }}
              >
                {btn.icon}
              </span>
            )}
            <span className="px-1">{btn.label}</span>
          </button>
        );
      })}
    </>
  );
}
