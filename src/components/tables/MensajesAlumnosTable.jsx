import React, { useMemo, useState } from "react";

const normalizeValue = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

const isYes = (value) => ["si", "sí", "1", 1, true, "true"].includes(normalizeValue(value));

const isNo = (value) =>
  ["no", "0", 0, false, "false", "", null, undefined].includes(
    normalizeValue(value),
  );

export default function MensajesAlumnosTable({ data = [] }) {
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

  const currentData = filteredData.slice(
    start,
    start + perPage
  );

  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    return [...pages]
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((a, b) => a - b)
      .reduce((items, pageNumber, index, pageNumbers) => {
        if (index > 0 && pageNumber - pageNumbers[index - 1] > 1) {
          items.push("ellipsis-" + pageNumbers[index - 1]);
        }

        items.push(pageNumber);
        return items;
      }, []);
  }, [page, totalPages]);

  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
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
          <input
            type="text"
            className="form-control"
            placeholder="Buscar alumno..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table align-middle table-hover">
          <thead className="table-light">
            <tr>
              <th>Alumno</th>
              <th>Matrícula</th>
              <th>Leído</th>
              <th>Respuesta rápida</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-muted py-4"
                >
                  No hay alumnos
                </td>
              </tr>
            ) : (
              currentData.map((row, idx) => (
                <tr key={idx}>
                  {/* ALUMNO */}
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`https://ik.imagekit.io/softwareincorp/ChatGPT%20Image%2027%20may%202026,%2007_59_29%20p.m..png`}
                        alt="foto"
                        className="rounded-circle me-3"
                        width="45"
                        height="45"
                        style={{
                          objectFit: "cover",
                          border: "2px solid #e9ecef",
                        }}
                      />

                      <div>
                        <div className="fw-semibold">
                          {row.estudiante}
                        </div>

                        <small className="text-muted">
                          ID: {row.sid_alumno}
                        </small>
                      </div>
                    </div>
                  </td>

                  {/* MATRICULA */}
                  <td>
                    <span className="badge bg-light text-dark border">
                      {row.matricula}
                    </span>
                  </td>

                  {/* LEIDO */}
                  <td>
                    <span
                      className={`badge ${
                        row.leido === "si"
                          ? "bg-success-subtle text-success"
                          : "bg-dark-subtle text-dark"
                      }`}
                    >
                      {row.leido === "si"
                        ? "Leído"
                        : "Pendiente"}
                    </span>
                  </td>

                  {/* RESPUESTA RAPIDA */}
                  <td>
                    {isYes(row.respuesta_rapida) ? (
                      <span className="badge bg-success-subtle text-success">
                        Habilitada
                      </span>
                    ) : !isNo(row.respuesta_rapida) ? (
                      <div className="text-success fw-semibold">
                        {row.respuesta_rapida}
                      </div>
                    ) : (
                      <span className="text-muted">
                        Sin respuesta
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
        <div>
          <small className="text-muted d-block">
            Mostrando {filteredData.length === 0 ? 0 : start + 1} a{" "}
            {Math.min(
              start + perPage,
              filteredData.length
            )}{" "}
            de {filteredData.length} registros
          </small>
          <small className="fw-semibold text-dark">
            Página {totalPages === 0 ? 0 : page} de {totalPages}
          </small>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>

          {visiblePages.map((pageNumber) =>
            typeof pageNumber === "string" ? (
              <span key={pageNumber} className="px-1 text-muted">
                ...
              </span>
            ) : (
              <button
                key={pageNumber}
                type="button"
                className={`btn btn-sm ${
                  pageNumber === page
                    ? "btn-primary"
                    : "btn-light border text-dark"
                }`}
                aria-current={pageNumber === page ? "page" : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={
              page === totalPages || totalPages === 0
            }
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
