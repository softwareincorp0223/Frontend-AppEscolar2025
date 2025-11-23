import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import { InstitutoDataFilter } from "../../functions/general/DataActions";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";

export default function Estudiantes() {
  const [filtros, setFiltros] = useState({});
  const [alumnos, setAlumnos] = useState({});

  const manejarCambioFiltros = async (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    console.log("Filtros actuales:", nuevosFiltros);
    const sid_instituto = localStorage.getItem("sid_instituto");

    //const res = await InstitutoDataFilter(`alumno?include=Grado,Grupo,Nivel&where={"nombre":{"$like":"%${nuevosFiltros.buscar}%"}}&sid_instituto=${sid_instituto}`);
    const res = await InstitutoDataFilter(`alumno?include=Grado,Grupo,Nivel&where={"$or":[{"nombre":{"$like":"%${nuevosFiltros.buscar}%"}},{"apellido":{"$like":"%${nuevosFiltros.buscar}%"}}]}&sid_instituto=${sid_instituto}`);
    /* "$or": [{"nombre":{"$like":"%${nuevosFiltros.buscar}%"}},{"apellido":{"$like":"%${nuevosFiltros.buscar}%"}}]
    const res = await InstitutoDataFilter(
      `alumno?include=Grado,Grupo,Nivel&where={"$or":[{"nombre":{"$like":"%${nuevosFiltros.buscar}%"}},{"apellido":{"$like":"%${nuevosFiltros.buscar}%"}}]}&sid_instituto=${sid_instituto}`
        .replace(/"/g, "%22") // <- reemplaza comillas por %22 manualmente
        .replace(/%/g, "%25") // <- evita que los % se interpreten mal
    );
    */
    console.log("respuesta");
    console.log(res);
    //setData(data);

    //buscar: "asd", desde: "2025-10-29", hasta: "", nivel: "x8d5d", grado: "bdmyo", grupo: "B" }
    //usuario?where={"sid_instituto":"INST001","nombre":{"$like":"%Juan%"}}
    //const result = await InstitutoDataFilter('/alumno?where={"sid_instituto":"'+sid_instituto+'","nombre":{"$like":"%'+buscar+'%"}}');
    //console.log(result);
    //setAlumnos(result)
  };

  useEffect(() => {
    obtenerAlumnos(setAlumnos);
  }, []);

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Nivel", key: "Nivel" },
    { label: "Grado", key: "Grado" },
    { label: "Grupo", key: "Grupo" },
  ];

  const formFields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Ej. Juan",
      required: true,
    },
    {
      name: "apellido",
      label: "Apellido",
      type: "text",
      placeholder: "Ej. Pérez",
      required: true,
    },
    {
      name: "matricula",
      label: "Matricula",
      type: "text",
      placeholder: "Ej. AB123",
      required: false,
    },
    {
      name: "sexo",
      label: "Sexo",
      type: "select",
      options: ["MASCULINO", "FEMENINO"],
      required: false,
    },
    {
      name: "nivel",
      label: "Nivel",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
      required: true,
    },
    {
      name: "grado",
      label: "Grado",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
      required: true,
    },
    {
      name: "grupo",
      label: "Grupo",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
      required: true,
    },
    {
      name: "padre",
      label: "Padre",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
      required: true,
    },
    {
      name: "foto_estudiante",
      label: "Foto",
      type: "file",
      required: false,
    },
  ];

  //const handleFormSubmit = (values) => {
  //  console.log("Datos enviados:", values);
  //  showAlert("success", "Este es un alert global");
  //};

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
            {/* Agregar estudiantes 
            <Form
              title="Agregar Alumnos"
              fields={formFields}
              columns={3}
              //onSubmit={handleFormSubmit}
            />
            */}
            <Filter
              enabledFilters={["buscar", "rango", "nivel", "grado", "grupo"]}
              nombreFiltro="Estudiantes"
              onFilterChange={manejarCambioFiltros}
            />

            {/* Tabla estudiantes */}
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
              onSelectionChange={(ids) => setDeleteCheck(ids)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
