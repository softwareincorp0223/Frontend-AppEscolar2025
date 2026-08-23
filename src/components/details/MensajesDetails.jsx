import React, { useState, useEffect } from "react";
import { fechaFormateada } from "../../functions/general/Functions";
import {
  obtenerMensaje,
  obtenerAlumnosMensaje,
} from "../../functions/MensajeActions";
import MensajesAlumnosTable from "../tables/MensajesAlumnosTable";
import Loader from "../../functions/general/Loader";

const TRUE_VALUES = ["si", "sí", "1", 1, true, "true"];

const isActive = (value) =>
  TRUE_VALUES.includes(
    typeof value === "string" ? value.trim().toLowerCase() : value,
  );

const hasDate = (value) => value && value !== "0000-00-00";

const getResourceUrl = (item) =>
  item?.url || item?.archivo || item?.link || item?.ruta || "";

const isImageUrl = (url) =>
  /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);

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

  const esProgramado = isActive(mensajeIndividual?.mensaje_programado);
  const permiteRespuestaRapida = isActive(mensajeIndividual?.respuesta_rapida);
  const seRepite = isActive(mensajeIndividual?.repetir);

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
                        {esProgramado ? "Sí" : "No"}
                      </span>
                    </div>

                    <div className={`col-md-4 mb-2 ${esProgramado ? "" : "d-none"}`}>
                      <small className="text-muted d-block">
                        Fecha de envío
                      </small>

                      <span className="fw-semibold">
                        {esProgramado && hasDate(mensajeIndividual?.fecha_envio)
                          ? fechaFormateada(mensajeIndividual.fecha_envio, {
                              paraUI: true,
                            })
                          : esProgramado
                            ? "Sin información"
                            : "No aplica"}
                      </span>
                    </div>

                    <div className={`col-md-4 mb-2 ${esProgramado ? "" : "d-none"}`}>
                      <small className="text-muted d-block">
                        Hora de envío
                      </small>

                      <span className="fw-semibold">
                        {esProgramado
                          ? mensajeIndividual?.hora_envio || "Sin información"
                          : "No aplica"}
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
                    {permiteRespuestaRapida ? "Sí" : "No"}
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
                        {seRepite ? "Sí" : "No"}
                      </span>
                    </div>

                    <div className={`col-md-3 mb-2 ${seRepite ? "" : "d-none"}`}>
                      <small className="text-muted d-block">Fecha inicio</small>

                      <span className="fw-semibold">
                        {seRepite && hasDate(mensajeIndividual?.fecha_envio)
                          ? fechaFormateada(mensajeIndividual.fecha_envio, {
                              paraUI: true,
                            })
                          : seRepite
                            ? "Sin información"
                            : "No aplica"}
                      </span>
                    </div>

                    <div className={`col-md-3 mb-2 ${seRepite ? "" : "d-none"}`}>
                      <small className="text-muted d-block">Periodo</small>

                      <span className="fw-semibold">
                        {mensajeIndividual?.periodo || "Sin información"}
                      </span>
                    </div>

                    <div className={`col-md-3 mb-2 ${seRepite ? "" : "d-none"}`}>
                      <small className="text-muted d-block">Fecha fin</small>

                      <span className="fw-semibold">
                        {seRepite && hasDate(mensajeIndividual?.fecha_fin)
                          ? fechaFormateada(mensajeIndividual.fecha_fin, {
                              paraUI: true,
                            })
                          : seRepite
                            ? "Sin información"
                            : "No aplica"}
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
                        mensajeIndividual.archivos.map((item, index) => {
                          const url = getResourceUrl(item);

                          return (
                            <li
                              key={item.id_archivo_mensaje || index}
                              className="list-group-item bg-transparent px-0"
                            >
                              {url ? (
                                <div className="d-flex align-items-center gap-3">
                                  {isImageUrl(url) ? (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="d-inline-block"
                                    >
                                      <img
                                        src={url}
                                        alt={`Adjunto ${index + 1}`}
                                        style={{
                                          width: "72px",
                                          height: "72px",
                                          objectFit: "cover",
                                          borderRadius: "6px",
                                          border: "1px solid #e5e5e5",
                                        }}
                                      />
                                    </a>
                                  ) : (
                                    <i
                                      className="material-icons text-secondary"
                                      style={{ fontSize: "36px" }}
                                    >
                                      attach_file
                                    </i>
                                  )}

                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                  >
                                    {isImageUrl(url) ? "Ver imagen" : "Ver archivo"}
                                  </a>
                                </div>
                              ) : (
                                <span className="text-muted">
                                  Archivo sin URL
                                </span>
                              )}
                            </li>
                          );
                        })
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
