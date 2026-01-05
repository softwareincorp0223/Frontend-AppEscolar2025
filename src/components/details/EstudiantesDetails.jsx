import React from "react";
import { fechaFormateada } from "../../functions/general/Functions";

export default function EstudianteDetails({ estudiante, onClose }) {
  return (
    <div
      className="card shadow-sm p-4 mt-2 mx-auto"
      style={{ maxWidth: "1100px" }}
    >
      {/* Top */}
      <div className="row mb-4">
        {/* Datos */}
        <div className="col-md-6">
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "5px",
            }}
          >
            <h6 className="fw-bold fs-5 mb-3">Datos del estudiante</h6>

            <p>
              <strong>Nombre completo:</strong> {estudiante.nombre}{" "}
              {estudiante.apellido}
            </p>
            <p>
              <strong>Matricula:</strong> {estudiante.matricula}
            </p>
            <p>
              <strong>Sexo:</strong> {estudiante.sexo}
            </p>
            <p>
              <strong>Nivel:</strong> {estudiante.Nivel}
            </p>
            <p>
              <strong>Grado:</strong> {estudiante.Grado}
            </p>
            <p>
              <strong>Grupo:</strong> {estudiante.Grupo}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "5px",
            }}
          >
            {/* Botón cerrar alineado a la derecha */}
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm text-danger fw-bold mb-2"
                onClick={onClose}
              >
                <i className="material-icons me-1" style={{ fontSize: "1rem" }}>
                  close
                </i>
                Cerrar
              </button>
            </div>

            {/* Contenido alineado a la izquierda */}
            <div className="mt-2">
              <h6 className="fw-bold mb-3 fs-5">Datos adicionales</h6>

              <p>
                <strong>Contacto de emergencia:</strong>{" "}
                {estudiante.nombre_contacto || "Sin información"}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {estudiante.telefono_contacto || "Sin información"}
              </p>
              <p>
                <strong>Alergias:</strong>{" "}
                {estudiante.alergias || "Sin información"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
