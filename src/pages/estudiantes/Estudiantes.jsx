import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";
import { filtrarTabla } from "../../functions/general/Functions";

export default function Estudiantes() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosOriginal, setAlumnosOriginal] = useState([]);

  const manejarCambioFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: alumnosOriginal,
    });

    setAlumnos(resultado);
  };

  useEffect(() => {
    obtenerAlumnos((res) => {
      setAlumnosOriginal(res);
      setAlumnos(res);
    });
  }, []);

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Nivel", key: "Nivel" },
    { label: "Grado", key: "Grado" },
    { label: "Grupo", key: "Grupo" },
  ];

  return (
    <Layout>
      <div className="container-fluid py-4">
        <Filter
          enabledFilters={["buscar", "nivel", "grado", "grupo"]}
          nombreFiltro="Estudiantes"
          onFilterChange={manejarCambioFiltros}
        />

        <Table
          id="alumnosTable"
          title="Alumnos"
          columns={columns}
          data={alumnos}
          showCheckbox={true}
          renderActions={(row) => (
            <ActionButtons row={row} actions={["view", "edit", "delete"]} />
          )}
          headerButtons={(row) => (
            <TableButtons row={row} actions={["delete", "excel"]} />
          )}
        />
      </div>
    </Layout>
  );
}
