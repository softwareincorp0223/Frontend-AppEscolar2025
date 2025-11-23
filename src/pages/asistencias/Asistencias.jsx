import React, { useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";

export default function Asistencias() {
  const dataOriginal = [
    {
      mensaje_id: "1",
      estudiante: "Juan Pérez",
      nivel: "Primaria",
      grado: "3",
      grupo: "A",
      fecha_y_hora: "2025-10-01 08:00",
      tipo: "Entrada",
      registrado_por: "Admin",
    },
    {
      mensaje_id: "2",
      estudiante: "Ana Gómez",
      nivel: "Secundaria",
      grado: "1",
      grupo: "B",
      fecha_y_hora: "2025-10-01 08:10",
      tipo: "Entrada",
      registrado_por: "Admin",
    },
  ];

  const columns = [
    { label: "Nombre", key: "estudiante" },
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
    { label: "Fecha Hora", key: "fecha_y_hora" },
    { label: "Tipo", key: "tipo" },
    { label: "Registrado por", key: "registrado_por" },
  ];

  const [asistencias, setAsistencias] = useState(dataOriginal);

  const filtrarDatos = (filtros) => {
    let filtrado = dataOriginal;

    if (filtros.buscar) {
      const buscarLower = filtros.buscar.toLowerCase();
      filtrado = filtrado.filter((d) =>
        d.estudiante.toLowerCase().includes(buscarLower)
      );
    }

    if (filtros.nivel) {
      filtrado = filtrado.filter((d) => d.nivel === filtros.nivel);
    }

    if (filtros.grado) {
      filtrado = filtrado.filter((d) => d.grado === filtros.grado);
    }

    if (filtros.grupo) {
      filtrado = filtrado.filter((d) => d.grupo === filtros.grupo);
    }

    if (filtros.desde) {
      filtrado = filtrado.filter(
        (d) => new Date(d.fecha_y_hora) >= new Date(filtros.desde)
      );
    }

    if (filtros.hasta) {
      filtrado = filtrado.filter(
        (d) => new Date(d.fecha_y_hora) <= new Date(filtros.hasta)
      );
    }

    setAsistencias(filtrado);
  };

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
              onFilterChange={filtrarDatos}
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
