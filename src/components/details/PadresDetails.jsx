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
            <h6 className="fw-bold mb-3">Datos del padre</h6>

            <p>
              <strong>Nombres:</strong> {padre.nombre}
            </p>
            <p>
              <strong>Apellidos:</strong> {padre.apellido}
            </p>
            <p>
              <strong>Correo electrónico:</strong> {padre.correo}
            </p>
            <p>
              <strong>Creado:</strong>{" "}
              {fechaFormateada(padre.creacion, { paraUI: true })}
            </p>

            {/* QR */}
            <p>
              <strong>Código QR:</strong>{" "}
              <span
                className="text-success fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={descargarQR}
              >
                Descargar
              </span>
            </p>

            {/* Contraseña */}
            <p>
              <strong>Contraseña:</strong>{" "}
              {mostrarPassword ? (
                <>
                  <span className="fw-semibold ms-1">
                    {padre.contrasena}
                  </span>
                  <button
                    className="btn btn-sm fw-semibold text-danger ms-2 p-0"
                    onClick={() => setMostrarPassword(false)}
                  >
                    Ocultar
                  </button>
                </>
              ) : (
                <span
                  className="text-danger fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => setMostrarPassword(true)}
                >
                  Ver
                </span>
              )}
            </p>
          </div>
        </div>

        {/* QR */}
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

          <div className="d-flex justify-content-center">
            <QRCodeCanvas
              value={padre.codigo_qr}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
          </div>
        </div>
      </div>

      <hr />

      {/* Table */}
      <h6 className="fw-bold mb-2">Hijos Asignados</h6>
      <HijosTable data={hijos} />
    </div>
  );
}
