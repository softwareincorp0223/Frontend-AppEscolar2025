import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerAsistencias } from "../../functions/AsistenciasActions";

export default function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasOriginal, setAsistenciasOriginal] = useState([]);

  const manejarCambioFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: asistenciasOriginal,
    });

    setAsistencias(resultado);
  };

  useEffect(() => {
    obtenerAsistencias((res) => {
      setAsistenciasOriginal(res);
      setAsistencias(res);
    });
  }, []);

  const columns = [
    { label: "Nombre", key: "estudiante" },
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
    { label: "Fecha Hora", key: "fecha_y_hora" },
    {
      label: "Tipo",
      key: "tipo",
      render: (row) => {
        const esEntrada = row.tipo?.toLowerCase() === "entrada";
        return `
        <span
          style="
            display:inline-block;
            padding:3px 10px;
            border-radius:10px;
            font-size:12px;
            font-weight:700;
            color:white;
            background:${esEntrada ? "#22c55e" : "#ef4444"};
          "
        >
        ${row.tipo}
      </span>
    `;
      },
    },
    { label: "Registrado por", key: "registrado_por" },
  ];

  return (
    <Layout>
      <div className="container mt-2"></div>
      <div className="container-fluid py-4" style={{ paddingLeft: "3px" }}>
        {/* Filtro Asistencias */}

        <div className="row g-4 g-lg-4">
          <div className="col-lg-12">
            {/* Tabla Asistencias */}
            <Filter
              enabledFilters={["buscar", "rango", "nivel", "grado", "grupo"]}
              nombreFiltro="Estudiantes"
              onFilterChange={manejarCambioFiltros}
            />
            <Table
              id="asistenciasTable"
              title="Asistencias"
              columns={columns}
              data={asistencias}
              renderActions=""
              headerButtons={(row) => (
                <TableButtons
                  row={row}
                  actions={[
                    "excel", // usa botón predefinido
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
