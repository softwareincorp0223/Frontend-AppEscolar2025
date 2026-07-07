import React, { useMemo, useState } from "react";

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
                    {row.respuesta_rapida ? (
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
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Mostrando {filteredData.length === 0 ? 0 : start + 1} a{" "}
          {Math.min(
            start + perPage,
            filteredData.length
          )}{" "}
          de {filteredData.length} registros
        </small>

        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>

          <span className="btn btn-sm btn-light border">
            {page}
          </span>

          <button
            className="btn btn-sm btn-outline-secondary ms-2"
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