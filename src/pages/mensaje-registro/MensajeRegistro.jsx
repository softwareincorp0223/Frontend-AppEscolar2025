import React, { useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";

export default function MensajeRegistro() {
  const dataRegistros = [
    {
      mensaje_id: "1",
      asunto: "asunto",
      emisor: "emisor",
      fecha_de_envio: "fecha_de_envio",
      responsable: "responsable",
      fecha_de_eliminacion: "fecha_de_eliminacion",
    },
  ];

  const columns = [
    { label: "Asunto", key: "asunto" },
    { label: "Emisor", key: "emisor" },
    { label: "Fecha De Envío", key: "fecha_de_envio" },
    { label: "Responsable", key: "responsable" },
    { label: "Fecha De Eliminacion", key: "fecha_de_eliminacion" },
  ];

  const [registros, setRegistros] = useState(dataRegistros);
  

  // funciones para acciones de la tabla
  const handleEdit = (id) => {
    console.log("Editar registro:", id);
    showAlert("info", `Editar mensaje con ID ${id}`);
  };

  const handleDelete = (id) => {
    console.log("Eliminar registro:", id);
    // Podrías meter un confirm primero
    showAlert(
      "warning",
      `¿Seguro que deseas eliminar el mensaje con ID ${id}?`
    );
  };

  const handleFormSubmit = (values) => {
    console.log("Datos enviados:", values);
    showAlert("success", "Este es un alert global");
  };

  
  const filtrarDatos = (filtros) => {
    let filtrado = dataRegistros;

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

    setRegistros(filtrado);
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
            {/* Filtro Historial */}
            <Filter
              //onFilterChange={filtrarDatos}
              enabledFilters={["buscar", "rango"]}
              nombreFiltro="Mensajes"
              onFilterChange={filtrarDatos}
            />

            {/* Tabla Registro */}
            <Table
              id="registroTable"
              title="Registro"
              columns={columns}
              data={registros}
              renderActions={(row) => (
                <ActionButtons row={row} actions={["restore"]} />
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
