import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import ActionButtons from "../../components/ActionButtons";
import Filter from "../../components/Filter";
import { obtenerRegistroMensajes } from "../../functions/MensajeRegistroActions";
import { handleRestore } from "../../functions/MensajeActions";
import { filtrarTabla } from "../../functions/general/Functions";

export default function MensajeRegistro() {
  const [registros, setRegistros] = useState([]);
  const [registrosOriginal, setRegistrosOriginal] = useState([]);

  const manejarCambioFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: registrosOriginal,
    });

    setRegistros(resultado);
  };

  useEffect(() => {
    obtenerRegistroMensajes((res) => {
      setRegistrosOriginal(res);
      setRegistros(res);
    });
  }, []);

  const columns = [
    { label: "Asunto", key: "asunto" },
    { label: "Emisor", key: "emisor" },
    { label: "Fecha De Envío", key: "fecha_de_envio" },
    { label: "Fecha De Eliminacion", key: "fecha_de_eliminacion" },
  ];

  // funciones para acciones de la tabla
  const handleEdit = (id) => {
    console.log("Editar registro:", id);
    showAlert("info", `Editar mensaje con ID ${id}`);
  };

  const handleFormSubmit = (values) => {
    console.log("Datos enviados:", values);
    showAlert("success", "Este es un alert global");
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
              onFilterChange={manejarCambioFiltros}
            />

            {/* Tabla Registro */}
            <Table
              id="registroTable"
              title="Registro"
              columns={columns}
              data={registros}
              renderActions={(row) => (
                <ActionButtons 
                row={row} 
                actions={[
                    {
                      label: "Restaurar",
                      icon: "restore",
                      className: "btn-outline-success",
                      onClick: (row) =>
                        handleRestore(row, obtenerRegistroMensajes),
                    },
                  ]}
                />
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
