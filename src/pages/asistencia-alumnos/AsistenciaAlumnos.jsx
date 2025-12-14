import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";

export default function AsistenciaAlumnos() {

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
    { label: "Matricula", key: "matricula" },
    { label: "Nivel", key: "Nivel" },
    { label: "Grado", key: "Grado" },
    { label: "Grupo", key: "Grupo" },
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
            {/* Filtrar Estudiantes */}

            <Filter
              enabledFilters={["buscar", "nivel", "grado", "grupo"]}
              nombreFiltro="Estudiantes"
              onFilterChange={manejarCambioFiltros}
            />
            {/* Tabla Estudiantes */}
            <Table
              id="asistenciaEstudianteTable"
              title="Estudiantes"
              columns={columns}
              data={alumnos}
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
