import React from "react";

export default function UserDetails({ user, onClose }) {
  return (
    <div className="card shadow-sm p-4 mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h5 className="mb-0">Datos del Usuario</h5>
        <button className="btn btn-sm text-danger fw-bold" onClick={onClose}>
          <i className="material-icons me-1" style={{ fontSize: "1rem", position: "relative", top: "3px" }}>close</i> Cerrar
        </button>
      </div>

      <hr />

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Nombre:</strong> {user.nombre}
        </li>
        <li className="list-group-item">
          <strong>Apellido:</strong> {user.apellido}
        </li>
        <li className="list-group-item">
          <strong>Correo:</strong> {user.correo}
        </li>
        <li className="list-group-item">
          <strong>Rol:</strong> {user.Rol || "Sin rol"}
        </li>
        <li className="list-group-item">
          <strong>Creación:</strong> {user.creacion}
        </li>
        <li className="list-group-item">
          <strong>Modificación:</strong> {user.modificacion}
        </li>
      </ul>
    </div>
  );
}
