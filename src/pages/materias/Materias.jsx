import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerMaterias, handleDelete, handleSave } from "../../functions/MateriasActions";

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [editingMateria, setEditingMateria] = useState(null);

  useEffect(() => {
    obtenerMaterias(setMaterias);
  }, []);

  const formMateria = [
    { name: "nombre", label: "Materia", type: "text", placeholder: "Ej. Español", required: true },
  ];

  const columnsMaterias = [
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingMateria ? "Editar Materia" : "Agregar Materia"}
        fields={formMateria}
        columns={1}
        onSubmit={(values) => handleSave(values, editingMateria, setEditingMateria, () => obtenerMaterias(setMaterias))}
        initialValues={
          editingMateria
            ? {
              nombre: editingMateria.nombre,

            }
            : {}
        }
      />

      <Table
        id="materiasTable"
        title="Materias"
        columns={columnsMaterias}
        data={materias}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerMaterias(setMaterias))}
            onEdit={() => setEditingMateria(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
