import React, { useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";

export default function Tareas() {
  const dataTareas = [
    {
      mensaje_id: "1",
      nivel: "nivel",
      grado: "grado",
      grupo: "grupo",
      creada: "creada",
      materia: "materia",
      profesor: "profesor",
    },
  ];

  const columns = [
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
    { label: "Creado", key: "creada" },
    { label: "Materia", key: "materia" },
    { label: "Profesor", key: "profesor" },
  ];


  const [tareas, setTareas] = useState(dataTareas);

  const filtrarDatos = (filtros) => {
    let filtrado = dataTareas;

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

    setTareas(filtrado);
  };

  // funciones para acciones de la tabla

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
            <Filter
              //onFilterChange={filtrarDatos}
              enabledFilters={["buscar", "rango", "nivel", "grado", "grupo"]}
              nombreFiltro="Tareas"
              onFilterChange={filtrarDatos}
            />

            {/* Tabla Estudiantes */}
            <Table
              id="tareasTable"
              title="Tareas"
              columns={columns}
              data={tareas}
              renderActions={(row) => (
                <ActionButtons row={row} actions={["view", , "delete"]} />
              )}
              headerButtons={(row) => (
                <TableButtons row={row} actions={["excel"]} />
              )}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
