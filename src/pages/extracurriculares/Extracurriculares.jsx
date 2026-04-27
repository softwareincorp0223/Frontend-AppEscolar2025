import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import ExtracurricularDetails from "../../components/details/ExtracurricularDetails";
import { obtenerExtracurricular, handleDelete, handleSave, obtenerExtracurricularesExcel } from "../../functions/ExtracurricularActions";
import { exportarExcel } from "../../functions/general/exportarExcel";

export default function Extracurriculares() {
  const [extracurriculares, setExtracurriculares] = useState([]);
  const [extracurricularesExcel, setExtracurricularesExcel] = useState([]);
  const [editingExtracurricular, setEditingExtracurricular] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);

  useEffect(() => {
    obtenerExtracurricular(setExtracurriculares);
    obtenerExtracurricularesExcel(setExtracurricularesExcel);
  }, []);

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Matricula", "Nivel", "Grado", "Grupo", "Extracurricular"];
    exportarExcel("ExtracurricularInstituto", encabezados, extracurricularesExcel);
  };
  
  const tableHandlers = {
    excel: botonExcel,
  };

  const formExtracurricular = [
    { name: "nombre", label: "Extracurricular", type: "text", placeholder: "Ej. Futbol", required: true },
  ];

  const columnsExtracurricular = [
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingExtracurricular ? "Editar Extracurricular" : "Agregar Extracurricular"}
        fields={formExtracurricular}
        columns={1}
        onSubmit={(values) => handleSave(values, editingExtracurricular, setEditingExtracurricular, () => obtenerExtracurricular(setExtracurriculares))}
        initialValues={
          editingExtracurricular
            ? {
              nombre: editingExtracurricular.nombre,
            }
            : {}
        }
      />
      {selectedExtra ? (
        <ExtracurricularDetails alumno={selectedExtra} onClose={() => setSelectedExtra(null)} />
      ) : (

        <Table
          id="extracurricularTable"
          title="Extracurricular"
          columns={columnsExtracurricular}
          data={extracurriculares}
          renderActions={(row) => (
            <ActionButtons
              row={row}
              setSelectedUser={setSelectedExtra}
              onDelete={() => handleDelete(row, () => obtenerExtracurricular(setExtracurriculares))}
              onEdit={() => setEditingExtracurricular(row)}
              actions={["view", "edit", "delete"]}
            />
          )}
          headerButtons={(row) => (
            <TableButtons row={row}
              actions={["excel"]}
              onActions={tableHandlers}
            />
          )}
        />
      )}
    </Layout>
  );
}
