import React, { useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";


export default function AsistenciaAlumnos() {

  const dataasistenciaAlumnos = [
    { mensaje_id: "1", nombre: "nombre", matricula: "matricula", nivel: "nivel", grado: "grado", grupo: "grupo" },
  ];

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Matricula", key: "matricula" },
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
  ];

  const formFields = [
    {
      name: "buscar",
      label: "Desde",
      type: "text",
      placeholder: "Ej. Estudiante",
    },
    {
      name: "nivel",
      label: "Nivel",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
    },
    {
      name: "grado",
      label: "Grado",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
    },
    {
      name: "grupo",
      label: "Grupo",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
    },
  ];

  const [asistenciaAlumnos, setAsistenciasAlumnos] = useState(dataasistenciaAlumnos);

  const filtrarDatos = (filtros) => {
    let filtrado = dataasistenciaAlumnos;

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

    setAsistenciasAlumnos(filtrado);
  };

  return (
    <Layout>
      <div className="container mt-2"></div>

      {/* Contenido */}
      <div
        className="container-fluid py-4 py-lg-4"
        style={{ paddingLeft: "3px" }}
      >
        <div className="row g-4 g-lg-4">

          <div className="col-lg-12">
            {/* Filtrar Estudiantes */}

            <Filter
              enabledFilters={["buscar", "rango", "nivel", "grado", "grupo"]}
              nombreFiltro="Estudiantes"
              onFilterChange={filtrarDatos}
            />
            {/* Tabla Estudiantes */}
            <Table
              id="asistenciaEstudianteTable"
              title="Estudiantes"
              columns={columns}
              data={asistenciaAlumnos}
              renderActions={(row) => (
                <ActionButtons row={row} actions={["qr"]} />
              )}
              headerButtons={(row) => (
                <TableButtons row={row} actions={["qr_code"]} />
              )}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
