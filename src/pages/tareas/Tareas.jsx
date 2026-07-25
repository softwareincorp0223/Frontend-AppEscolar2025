import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";
import { filtrarTabla } from "../../functions/general/Functions";
import { handleDelete, handleDeleteVarios, obtenerTareas } from "../../functions/TeareasActions";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import { exportarExcel } from "../../functions/general/ExportarExcel";
import TareasDetails from "../../components/details/TareasDetails";
import DetailsContainer from "../../functions/general/DetailsContainer";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [tareasOriginal, setTareasOriginal] = useState([]);
  const [deleteCheck, setDeleteCheck] = useState([]);
  const [selectedTarea, setSelectedTarea] = useState(null);

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

  const deleteVarios = () => {
    handleDeleteVarios(deleteCheck, setTareas);
  };

  const botonExcel = () => {
    const encabezados = ["Nivel", "Grado", "Grupo", "Creado", "Materia", "Profesor"];
    const tareasExcel = tareas.map((tarea) => ({
      Nivel: tarea.nivel,
      Grado: tarea.grado,
      Grupo: tarea.grupo,
      Creado: tarea.creada,
      Materia: tarea.materia,
      Profesor: tarea.profesor,
    }));

    exportarExcel("Tareas", encabezados, tareasExcel);
  };

  const tableHandlers = {
    delete: deleteVarios,
    excel: botonExcel,
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
              showCheckbox={true}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  setSelectedUser={setSelectedTarea}
                  actions={["view", "delete"]}
                  onDelete={() =>
                    handleDelete(row, () => obtenerTareas(setTareas))
                  }
                />
              )}
              headerButtons={(row) => (
                <TableButtons
                  row={row}
                  actions={["delete", "excel"]}
                  onActions={tableHandlers}
                />
              )}
              onSelectionChange={(ids) => setDeleteCheck(ids)}
            />

            <DetailsContainer visible={!!selectedTarea} top={650}>
              <TareasDetails
                tarea={selectedTarea}
                onClose={() => setSelectedTarea(null)}
              />
            </DetailsContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
