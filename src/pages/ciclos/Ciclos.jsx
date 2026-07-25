import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import {
  obtenerCiclos,
  obtenerEstadoCiclos,
  handleDelete,
  handleSave,
  ejecutarPasarCiclo,
  handlePasarCiclo,
  handleRegularizarEscuela,
} from "../../functions/CiclosActions";

export default function Ciclos() {
  const [ciclos, setCiclos] = useState([]);
  const [editingCiclo, setEditingCiclo] = useState(null);
  const [estadoCiclos, setEstadoCiclos] = useState(null);
  const [faltantesGrupo, setFaltantesGrupo] = useState([]);
  const [grupoDestinoPorFaltante, setGrupoDestinoPorFaltante] = useState({});

  const refrescarCiclos = async () => {
    await obtenerCiclos(setCiclos);
    await obtenerEstadoCiclos(setEstadoCiclos);
  };

  useEffect(() => {
    refrescarCiclos();
  }, []);

  const formCiclo = [
    { name: "nombre", label: "Ciclo", type: "text", placeholder: "2025", required: true },
  ];

  const columnsCiclos = [
    { label: "Nombre", key: "nombre" },
    { label: "Orden", key: "orden" },
    {
      label: "Estado",
      key: "ciclo_cerrado",
      render: (row) => row.ciclo_cerrado ? "Cerrado" : "Abierto",
    },
  ];

  const abrirModalFaltantes = (faltantes) => {
    const valoresIniciales = {};
    faltantes.forEach((faltante) => {
      valoresIniciales[faltante.key] = faltante.grupos_disponibles?.[0]?.id_grupo || "";
    });

    setGrupoDestinoPorFaltante(valoresIniciales);
    setFaltantesGrupo(faltantes);
  };

  const cerrarModalFaltantes = () => {
    setFaltantesGrupo([]);
    setGrupoDestinoPorFaltante({});
  };

  const confirmarPasoConGrupos = async () => {
    const overrides = faltantesGrupo.map((faltante) => ({
      key: faltante.key,
      sid_grupo_destino: grupoDestinoPorFaltante[faltante.key],
    }));

    await ejecutarPasarCiclo(refrescarCiclos, overrides);
    cerrarModalFaltantes();
  };

  const puedeContinuarConFaltantes =
    faltantesGrupo.length > 0 &&
    faltantesGrupo.every((faltante) => grupoDestinoPorFaltante[faltante.key]);

  return (
    <Layout>
      {estadoCiclos && !estadoCiclos.tiene_ciclo_abierto && (
        <div className="alert alert-warning mx-4 mt-4 mb-0">
          No existe un ciclo abierto. Agrega un ciclo para iniciar el proceso.
        </div>
      )}

      {estadoCiclos?.requiere_regularizar && (
        <div className="alert alert-info mx-4 mt-4 mb-0">
          La escuela tiene un ciclo abierto, pero aun no esta regularizada.
        </div>
      )}

      <Form
        title={editingCiclo ? "Editar Ciclo" : "Agregar Ciclo"}
        fields={formCiclo}
        columns={1}
        onSubmit={(values) => handleSave(values, editingCiclo, setEditingCiclo, refrescarCiclos)}
        initialValues={
          editingCiclo
            ? {
              nombre: editingCiclo.nombre,

            }
            : {}
        }
      />

      <Table
        id="ciclosTable"
        title="Ciclos"
        columns={columnsCiclos}
        data={ciclos}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, refrescarCiclos)}
            onEdit={() => setEditingCiclo(row)}
            actions={row.ciclo_cerrado ? ["edit"] : ["edit", "delete"]}
          />
        )}
        headerButtons={() => (
          <TableButtons
            actions={[
              ...(estadoCiclos?.requiere_regularizar ? ["regularizar"] : []),
              "ciclo",
            ]}
            onActions={{
              regularizar: () => handleRegularizarEscuela(refrescarCiclos),
              ciclo: () => handlePasarCiclo(refrescarCiclos, abrirModalFaltantes),
            }}
          />
        )}
      />

      {faltantesGrupo.length > 0 && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,.45)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar grupos destino</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={cerrarModalFaltantes}
                />
              </div>

              <div className="modal-body">
                <p className="text-muted mb-4">
                  Faltan grupos equivalentes en el siguiente grado. Puedes cancelar para crearlos o seleccionar un grupo existente para continuar.
                </p>

                <div className="d-flex flex-column gap-3">
                  {faltantesGrupo.map((faltante) => (
                    <div className="border rounded p-3" key={faltante.key}>
                      <div className="row g-3 align-items-end">
                        <div className="col-md-7">
                          <div className="fw-semibold">
                            {faltante.origen.nivel} {faltante.origen.grado} {faltante.origen.grupo}
                          </div>
                          <div className="text-muted small">
                            Destino: {faltante.destino.nivel} {faltante.destino.grado}
                          </div>
                          <div className="text-muted small">
                            Alumnos afectados: {faltante.total_alumnos}
                          </div>
                        </div>

                        <div className="col-md-5">
                          <label className="form-label small">Grupo destino</label>
                          <select
                            className="form-select"
                            value={grupoDestinoPorFaltante[faltante.key] || ""}
                            onChange={(event) =>
                              setGrupoDestinoPorFaltante((current) => ({
                                ...current,
                                [faltante.key]: event.target.value,
                              }))
                            }
                            disabled={!faltante.grupos_disponibles?.length}
                          >
                            {!faltante.grupos_disponibles?.length && (
                              <option value="">Sin grupos disponibles</option>
                            )}
                            {faltante.grupos_disponibles?.map((grupo) => (
                              <option key={grupo.id_grupo} value={grupo.id_grupo}>
                                {grupo.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={cerrarModalFaltantes}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmarPasoConGrupos}
                  disabled={!puedeContinuarConFaltantes}
                >
                  Continuar con grupos seleccionados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
