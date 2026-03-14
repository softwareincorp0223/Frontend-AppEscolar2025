import React, { useMemo, useState } from "react";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAlumnosExtracurricular, handleDeleteAlumnoExtracurricular } from "../../functions/ExtracurricularActions";



export default function ExtracurricularTable({ data = [], onDelete }) {


  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);


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

  console.log("asdasda");
  console.log(currentData);

  return (
    <div className="mt-4">
      {/* Header */}
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

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Alumno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No hay registros
                </td>
              </tr>
            ) : (
              currentData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.nombre_alumno}</td>
                  <td>
                    <ActionButtons
                      row={row}
                      actions={["delete"]}
                      onDelete={() => onDelete(row)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">
          Mostrando {start + 1} a{" "}
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
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
