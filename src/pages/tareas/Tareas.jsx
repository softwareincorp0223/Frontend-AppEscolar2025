import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerTareas } from "../../functions/TeareasActions";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [tareasOriginal, setTareasOriginal] = useState([]);

  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  /*nivel grado grupo */
  useEffect(() => {
    obtenerNiveles(setNiveles);
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGrados);

      setGrupos([]);
      setGradoSeleccionado(null);
    }
  }, [nivelSeleccionado]);

  useEffect(() => {
    if (gradoSeleccionado) {
      obtenerGruposPorGrados(gradoSeleccionado, setGrupos);
    }
  }, [gradoSeleccionado]);
  /*nivel grado grupo */

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

  const columns = [
    {
      label: "Nivel",
      key: "nivel",
    },
    {
      label: "Grado",
      key: "grado",
    },
    {
      label: "Grupo",
      key: "grupo",
    },
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
