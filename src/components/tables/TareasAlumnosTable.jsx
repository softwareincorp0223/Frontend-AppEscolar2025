import React, { useMemo, useState } from "react";
import ActionButtons from "../ActionButtons";

export default function TareasAlumnosTable({
  data = [],
  tarea,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    estatus: "",
    observacion: "",
  });

  const filteredData = useMemo(() => {
    if (!search) return data;

    const s = search.toLowerCase();

    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(s)
      )
    );
  }, [search, data]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const start = (page - 1) * perPage;
  const currentData = filteredData.slice(start, start + perPage);

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      estatus: row.estatus || "PENDIENTE",
      observacion: row.observacion || "",
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({
      estatus: "",
      observacion: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onEdit(editing, form);
    closeEdit();
  };

  const getStatusClass = (estatus) => {
    const estado = String(estatus || "").toLowerCase();

    if (estado === "entregado" || estado === "completado") {
      return "bg-success";
    }

    if (estado === "revisado") {
      return "bg-primary";
    }

    return "bg-warning text-dark";
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          Mostrar{" "}
          <select
            className="form-select d-inline w-auto mx-1"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>{" "}
          registros
        </div>

        <div>
          Buscar:{" "}
          <input
            type="text"
            className="form-control d-inline w-auto"
            placeholder="Término de búsqueda"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Alumno</th>
              <th>Estado</th>
              <th>Observación</th>
              <th>Creado</th>
              <th>Archivo</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No hay alumnos asignados
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr key={row.id_asignar_tarea}>
                  <td>{row.alumno}</td>
                  <td>
                    <span className={`badge ${getStatusClass(row.estatus)}`}>
                      {row.estatus || "PENDIENTE"}
                    </span>
                  </td>
                  <td>{row.observacion || "Sin observación"}</td>
                  <td>{tarea?.creada || "Sin fecha"}</td>
                  <td>
                    {row.archivo ? (
                      <a
                        href={row.archivo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      "Sin archivo"
                    )}
                  </td>
                  <td className="text-end">
                    <ActionButtons
                      row={row}
                      actions={["delete", "edit"]}
                      onDelete={() => onDelete(row)}
                      onEdit={() => openEdit(row)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">
          Mostrando {filteredData.length === 0 ? 0 : start + 1} a{" "}
          {Math.min(start + perPage, filteredData.length)} de{" "}
          {filteredData.length} registros
        </small>

        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-1"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <span className="btn btn-sm btn-light border">{page}</span>
          <button
            className="btn btn-sm btn-outline-secondary ms-1"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {editing && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Editar tarea del alumno</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEdit}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Alumno</label>
                  <input
                    className="form-control"
                    value={editing.alumno}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Estado</label>
                  <select
                    className="form-select"
                    value={form.estatus}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estatus: e.target.value,
                      })
                    }
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="ENTREGADO">Entregado</option>
                    <option value="REVISADO">Revisado</option>
                  </select>
                </div>

                <div>
                  <label className="form-label fw-semibold">Observación</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={form.observacion}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        observacion: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeEdit}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
