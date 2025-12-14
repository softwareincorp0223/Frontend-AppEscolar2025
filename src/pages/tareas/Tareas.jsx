import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerTareas } from "../../functions/TeareasActions";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [tareasOriginal, setTareasOriginal] = useState([]);

  const manejarCambioFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: tareasOriginal,
    });

    setTareas(resultado);
  };

  useEffect(() => {
    obtenerTareas((res) => {
      setTareasOriginal(res);
      setTareas(res);
    });
  }, []);

  /*const dataTareas = [
    {
      mensaje_id: "1",
      nivel: "nivel",
      grado: "grado",
      grupo: "grupo",
      creada: "creada",
      materia: "materia",
      profesor: "profesor",
    },
  ];*/

  const columns = [
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
    { label: "Creado", key: "creada" },
    { label: "Materia", key: "materia" },
    { label: "Profesor", key: "profesor" },
  ];

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
              enabledFilters={["buscar", "rango", "nivel", "grado", "grupo"]}
              nombreFiltro="Tareas"
              onFilterChange={manejarCambioFiltros}
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
