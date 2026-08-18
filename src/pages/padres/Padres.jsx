// src/pages/Padres.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import {
  obtenerPadres,
  handleDelete,
  handleSave,
  handleDeleteVarios,
} from "../../functions/PadresActions";
import { exportarExcel } from "../../functions/general/ExportarExcel";
import { exportarPDF } from "../../functions/general/ExportarPDF";
import PadreDetails from "../../components/details/PadresDetails";
import Modal from "../../components/Modal";

export default function Padres() {
  const [padres, setPadres] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteCheck, setDeleteCheck] = useState([]);
  const [selectedPadre, setSelectedPadre] = useState(null);
  const [loadingPadres, setLoadingPadres] = useState(true);

  useEffect(() => {
    obtenerPadres(setPadres).finally(() => setLoadingPadres(false));
  }, []);

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Correo", key: "correo" },
  ];

  // Funciones que usarán los botones
  const deleteVarios = () => {
    console.log("Eliminar varios:", deleteCheck);
    handleDeleteVarios(deleteCheck, setPadres);
  };

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Correo"];
    exportarExcel("PadresInstituto", encabezados, padres);
  };

  const botonPDF = () => {
    console.log("Exportando PDF...");
    const encabezados = ["Nombre", "Apellido", "Correo"];
    exportarPDF("PadresInstituto", encabezados, padres);
  };

  const subirDatos = () => {
    window.location.href = "/src/pages/cargar-datos/index.html"; // redirige al dashboard
  };

  //Handlers que se pasarán al componente
  const tableHandlers = {
    delete: deleteVarios,
    excel: botonExcel,
    pdf: botonPDF,
    datos: subirDatos,
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <Form
          title={editing ? "Editar Padre" : "Agregar Padre"}
          fields={[
            { name: "nombre", label: "Nombre", type: "text", required: true },
            {
              name: "apellido",
              label: "Apellidos",
              type: "text",
              required: true,
            },
            {
              name: "correo",
              label: "Correo electrónico",
              type: "email",
              required: true,
            },
          ]}
          columns={3}
          onSubmit={(values) =>
            handleSave(values, editing, setEditing, () =>
              obtenerPadres(setPadres),
            )
          }
          initialValues={editing || {}}
        />

        <>
          <Table
            id="padresTable"
            title="Padres"
            columns={columns}
            data={padres}
            showCheckbox={true}
            loading={loadingPadres}
            renderActions={(row) => (
              <ActionButtons
                row={row}
                setSelectedUser={setSelectedPadre}
                actions={["view", "edit", "delete"]}
                onDelete={() =>
                  handleDelete(row, () => obtenerPadres(setPadres))
                }
                onEdit={() => setEditing(row)}
              />
            )}
            headerButtons={(row) => (
              <TableButtons
                row={row}
                actions={["delete", "excel", "pdf", "datos"]}
                onActions={tableHandlers}
              />
            )}
            onSelectionChange={(ids) => setDeleteCheck(ids)}
          />

          <Modal
            isOpen={!!selectedPadre}
            title="Detalle del padre"
            onClose={() => setSelectedPadre(null)}
          >
            {selectedPadre && (
              <PadreDetails
                padre={selectedPadre}
                onClose={() => setSelectedPadre(null)}
              />
            )}
          </Modal>
        </>
      </div>
    </Layout>
  );
}
