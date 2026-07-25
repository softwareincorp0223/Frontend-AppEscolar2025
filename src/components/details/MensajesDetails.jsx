import React, { useState, useEffect } from "react";
import { fechaFormateada } from "../../functions/general/Functions";
import {
  obtenerMensaje,
  obtenerAlumnosMensaje,
} from "../../functions/MensajeActions";
import MensajesAlumnosTable from "../tables/MensajesAlumnosTable";
import Loader from "../../functions/general/Loader";

export default function MensajeDetails({ mensaje, onClose }) {
  const [mensajeIndividual, setMensaje] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);

  useEffect(() => {
    obtenerMensaje(mensaje.id_mensaje, setMensaje);

    setLoadingAlumnos(true);

    obtenerAlumnosMensaje(mensaje.id_mensaje, (data) => {
      setAlumnos(data);
      setLoadingAlumnos(false);
    });
  }, []);

  console.log(mensajeIndividual);

  return (
    <div
      className="card shadow-sm p-4 mt-2 mx-auto"
      style={{ maxWidth: "1100px" }}
    >
      <div className="row mb-4">
        {/* Datos */}

        {/* Datos */}
        <div className="col-md-6">
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "5px",
            }}
          >
            <h6 className="fw-bold fs-5 mb-3">Datos del mensaje</h6>

            {/* INFORMACION GENERAL */}
            <div className="card border-0 bg-light mb-3">
              <div className="card-body py-3">
                <h6 className="fw-bold text-secondary mb-3">
                  Información general
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <small className="text-muted d-block">
                      Tipo de mensaje
                    </small>

                    <span className="fw-semibold">
                      {mensaje.nombre_tipo || "Sin información"}
                    </span>
                  </div>

                  <div className="col-md-6 mb-3">
                    <small className="text-muted d-block">Receptor</small>

                    <span className="fw-semibold">
                      {mensaje?.receptor || "Sin información"}
                    </span>
                  </div>

                  <div className="col-12">
                    <small className="text-muted d-block">Asunto</small>

                    <span className="fw-semibold fs-6">
                      {mensajeIndividual?.asunto || "Sin información"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MENSAJE */}
            <div className="card border-0 bg-light">
              <div className="card-body py-3">
                <div className="d-flex align-items-center mb-3">
                  <i
                    className="material-icons text-secondary me-2"
                    style={{ fontSize: "20px" }}
                  >
                    mail
                  </i>

                  <h6 className="fw-bold text-secondary mb-0">
                    Contenido del mensaje
                  </h6>
                </div>

                <div
                  className="bg-white p-3"
                  style={{
                    borderRadius: "10px",
                    minHeight: "220px",
                    border: "1px solid #ececec",
                    lineHeight: "1.7",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mensajeIndividual?.mensaje || "Sin información",
                    }}
                  />
                </div>
              </div>
            </div>
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
            {/* <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm text-danger fw-bold mb-2"
                onClick={onClose}
              >
                <i className="material-icons me-1" style={{ fontSize: "1rem" }}>
                  close
                </i>
                Cerrar
              </button>
            </div> */}

            {/* Contenido alineado a la izquierda */}
            <div className="mt-2">
              <h6 className="fw-bold mb-3 fs-5">Datos adicionales</h6>

              {/* PROGRAMACION */}
              <div className="card border-0 bg-light mb-3">
                <div className="card-body py-3">
                  <h6 className="fw-bold text-secondary mb-3">
                    Programación del mensaje
                  </h6>

                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">
                        Mensaje programado
                      </small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.mensaje_programado ? "Sí" : "No"}
                      </span>
                    </div>

                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">
                        Fecha de envío
                      </small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.fecha_envio &&
                        mensajeIndividual.fecha_envio !== "0000-00-00"
                          ? fechaFormateada(mensajeIndividual.fecha_envio, {
                              paraUI: true,
                            })
                          : "Sin información"}
                      </span>
                    </div>

                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">
                        Hora de envío
                      </small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.hora_envio || "Sin información"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESPUESTA RAPIDA */}
              <div className="card border-0 bg-light mb-3">
                <div className="card-body py-3">
                  <h6 className="fw-bold text-secondary mb-3">
                    Respuesta rápida
                  </h6>

                  <small className="text-muted d-block">
                    Permite respuesta rápida
                  </small>

                  <span className="fw-semibold">
                    {mensajeIndividual?.respuesta_rapida ? "Sí" : "No"}
                  </span>
                </div>
              </div>

              {/* REPETICION */}
              <div className="card border-0 bg-light mb-3">
                <div className="card-body py-3">
                  <h6 className="fw-bold text-secondary mb-3">
                    Configuración de repetición
                  </h6>

                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Repetir</small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.repetir ? "Sí" : "No"}
                      </span>
                    </div>

                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Fecha inicio</small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.fecha_envio &&
                        mensajeIndividual.fecha_envio !== "0000-00-00"
                          ? fechaFormateada(mensajeIndividual.fecha_envio, {
                              paraUI: true,
                            })
                          : "Sin información"}
                      </span>
                    </div>

                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Fecha fin</small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.fecha_fin &&
                        mensajeIndividual.fecha_fin !== "0000-00-00"
                          ? fechaFormateada(mensajeIndividual.fecha_fin, {
                              paraUI: true,
                            })
                          : "Sin información"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* URLS Y ARCHIVOS */}
              <div className="card border-0 bg-light">
                <div className="card-body py-3">
                  <h6 className="fw-bold text-secondary mb-3">
                    Recursos adjuntos
                  </h6>

                  {/* URLS */}
                  <div className="mb-4">
                    <small className="text-muted d-block mb-2">URLs</small>

                    <ul className="list-group list-group-flush">
                      {mensajeIndividual?.urls?.length > 0 ? (
                        mensajeIndividual.urls.map((item, index) => (
                          <li
                            key={item.id_url || index}
                            className="list-group-item bg-transparent px-0"
                          >
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {item.url}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item bg-transparent px-0 text-muted">
                          Sin URLs
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* ARCHIVOS */}
                  <div>
                    <small className="text-muted d-block mb-2">Archivos</small>

                    <ul className="list-group list-group-flush">
                      {mensajeIndividual?.archivos?.length > 0 ? (
                        mensajeIndividual.archivos.map((item, index) => (
                          <li
                            key={item.id_archivo_mensaje || index}
                            className="list-group-item bg-transparent px-0"
                          >
                            <i className="material-icons align-middle me-2">
                              attach_file
                            </i>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {item.url}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item bg-transparent px-0 text-muted">
                          Sin archivos
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <h6 className="fw-bold mb-2">Alumnos</h6>
        {loadingAlumnos ? ( // 👈
          <Loader title="Cargando alumnos..." />
        ) : (
          <MensajesAlumnosTable data={alumnos} />
        )}
      </div>
    </div>
  );
}
