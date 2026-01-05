import React, { useState, useEffect } from "react";
import { fechaFormateada } from "../../functions/general/Functions";
import HijosTable from "../tables/HijosTable";
import { QRCodeCanvas } from "qrcode.react";
import { descargarQR } from "../../functions/general/Functions";
import { obtenerAlumnosPadres } from "../../functions/EstudiantesActions";

export default function PadreDetails({ padre, onClose }) {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [hijos, setHijos] = useState([]);

  useEffect(() => {
    obtenerAlumnosPadres(padre.id_padre, setHijos);
  }, []);

  return (
    <div
      className="card shadow-sm p-4 mt-2 mx-auto"
      style={{ maxWidth: "1100px" }}
    >
      {/* Top */}
      <div className="row mb-4">
        {/* Datos */}
        <div className="col-md-6">
          <div className="">
            <h6 className="fw-bold mb-3">Datos del estudiante</h6>

            <p>
              <strong>Nombre completo:</strong> {estudiante.nombre}  {estudiante.apellido}
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
            <p>
              <strong>Creado:</strong>{" "}
              {fechaFormateada(estudiante.creacion, { paraUI: true })}
            </p>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <button
            className="btn btn-sm text-danger fw-bold mb-2"
            onClick={onClose}
          >
            <i className="material-icons me-1" style={{ fontSize: "1rem" }}>
              close
            </i>
            Cerrar
          </button>

          <div className="d-flex ">
            <div className="">
              <h6 className="fw-bold mb-3">Datos adicionales</h6>

              <p>
                <strong>Contacto de emergencia:</strong> {estudiante.nombre_contacto || "Sin información"}
              </p>
              <p>
                <strong>Teléfono:</strong> {estudiante.telefono_contacto || "Sin información"}
              </p>
              <p>
                <strong>Alergias:</strong> {estudiante.alergias || "Sin información"}
              </p>
              <p>
                <strong>Creado:</strong>{" "}
                {fechaFormateada(estudiante.creacion, { paraUI: true })}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
