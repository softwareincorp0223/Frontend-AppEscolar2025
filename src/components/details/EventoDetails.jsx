import { useEffect, useState } from "react";
import { fechaFormateada } from "../../functions/general/Functions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";

export default function EventoDetails({
  evento,
  niveles = [],
  onClose,
  onDelete,
}) {
  const [gradosEvento, setGradosEvento] = useState([]);
  const [gruposEvento, setGruposEvento] = useState([]);

  const todaEscuela =
    evento.todos === true || evento.todos === 1 || evento.todos === "1";

  useEffect(() => {
    if (todaEscuela || !evento.nivel) {
      setGradosEvento([]);
      return;
    }

    obtenerGradosPorNivel(evento.nivel, setGradosEvento);
  }, [evento.nivel, todaEscuela]);

  useEffect(() => {
    if (todaEscuela || !evento.grado) {
      setGruposEvento([]);
      return;
    }

    obtenerGruposPorGrados(evento.grado, setGruposEvento);
  }, [evento.grado, todaEscuela]);

  const nivelEvento = niveles.find(
    (nivel) => String(nivel.id_nivel) === String(evento.nivel),
  );
  const gradoEvento = gradosEvento.find(
    (grado) => String(grado.id_grado) === String(evento.grado),
  );
  const grupoEvento = gruposEvento.find(
    (grupo) => String(grupo.id_grupo) === String(evento.grupo),
  );

  return (
    <div className="container-fluid mt-2" style={{ maxWidth: "1000px" }}>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="material-icons" style={{ fontSize: "36px" }}>
                  event
                </i>
              </div>

              <h4 className="fw-bold mb-3">{evento.nombre}</h4>

              <div className="card bg-light border-0 mb-3">
                <div className="card-body py-2">
                  <small className="text-muted d-block">Fecha</small>
                  <strong>
                    {fechaFormateada(evento.fecha, { paraUI: true }) ||
                      "Sin información"}
                  </strong>
                </div>
              </div>

              <div className="card bg-light border-0">
                <div className="card-body py-2">
                  <small className="text-muted d-block">Hora</small>
                  <strong>{evento.hora || "Sin información"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">Destino del evento</h5>
            </div>

            <div className="card-body">
              <div className="mb-4">
                <small className="text-muted d-block">Dirigido a</small>
                <span className="fw-semibold">
                  {todaEscuela ? "Toda la escuela" : "Grupo específico"}
                </span>
              </div>

              {!todaEscuela && (
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body py-3">
                        <small className="text-muted d-block">Nivel</small>
                        <strong>
                          {nivelEvento?.nombre || evento.nivel || "Sin asignar"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body py-3">
                        <small className="text-muted d-block">Grado</small>
                        <strong>
                          {gradoEvento?.nombre || evento.grado || "Sin asignar"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body py-3">
                        <small className="text-muted d-block">Grupo</small>
                        <strong>
                          {grupoEvento?.nombre || evento.grupo || "Sin asignar"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
              {/* <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button> */}

              <button
                type="button"
                className="btn btn-danger d-inline-flex align-items-center"
                onClick={onDelete}
              >
                <i className="material-icons me-1" style={{ fontSize: "18px" }}>
                  delete
                </i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
