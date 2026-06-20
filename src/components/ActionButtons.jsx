// src/components/ActionButtons.jsx
import React from "react";

//uso de componente
/*
<ActionButtons
  row={row}
  actions={[
    "edit", // usa botón predefinido
    "delete", // usa botón predefinido
    {
      label: "Descargar", // personalizado
      icon: "download",
      className: "btn-outline-warning",
      onClick: (id) => console.log("Descargar mensaje:", id),
    },
  ]}
/>
*/

export default function ActionButtons({
  actions = [],
  row,
  setSelectedUser,
  onDelete,
  onEdit,
  PdfData,
}) {
  //Funciones por boton

  //Ver mas Datos
  const ShowData = (row) => {
    if (setSelectedUser) setSelectedUser(row); // actualiza estado en el padre
  };

  //Restaurar Datos
  const RestoreData = (row) => {
    console.log("Restaurar:", row);
  };

  //QR Datos
  const QRData = (row) => {
    console.log("QR:", row);
  };

  // Botones predefinidos
  const predefined = {
    edit: {
      label: "Editar",
      icon: "edit",
      className: "btn-outline-primary",
      onClick: (row) => onEdit(row),
    },
    delete: {
      label: "Eliminar",
      icon: "delete",
      className: "btn-outline-danger",
      onClick: (row) => onDelete(row),
    },
    view: {
      label: "Ver más",
      icon: "visibility",
      className: "btn-outline-secondary",
      onClick: (row) => ShowData(row),
    },
    restore: {
      label: "Restaurar",
      icon: "restore",
      className: "btn-outline-success",
      onClick: (row) => RestoreData(row),
    },
    qr: {
      label: "Ver QR",
      icon: "qr_code",
      className: "btn-outline-dark",
      onClick: (row) => QRData(row),
    },
    pdf: {
      label: "PDF",
      icon: "picture_as_pdf",
      className: "btn-outline-primary",
      onClick: (row) => PdfData(row),
    },
  };

  return (
    <>
      {actions.map((action, idx) => {
        let btn;

        // 🔹 Caso 1: string → botón predefinido
        if (typeof action === "string" && predefined[action]) {
          btn = predefined[action];
        }

        // 🔹 Caso 2: objeto → botón personalizado
        if (typeof action === "object") {
          btn = {
            label: action.label,
            icon: action.icon,
            className: action.className || "btn-outline-secondary",
            onClick: action.onClick || (() => {}),
          };
        }

        if (!btn) return null;

        return (
          <button
            key={idx}
            className={`btn btn-sm ${btn.className} me-2`}
            onClick={() => btn.onClick(row.id ?? row)}
            title={btn.label}
          >
            {btn.icon && (
              <span
                className="material-icons align-middle"
                style={{ fontSize: "1rem", position: "relative", top: "-1px" }}
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
