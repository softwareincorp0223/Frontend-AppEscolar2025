import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerCiclos, handleDelete, handleSave } from "../../functions/CiclosActions";

export default function Ciclos() {
  const [ciclos, setCiclos] = useState([]);
  const [editingCiclo, setEditingCiclo] = useState(null);

  useEffect(() => {
    obtenerCiclos(setCiclos);
  }, []);

  const formCiclo = [
    { name: "nombre", label: "Ciclo", type: "text", placeholder: "2025", required: true },
  ];

  const columnsCiclos = [
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingCiclo ? "Editar Ciclo" : "Agregar Ciclo"}
        fields={formCiclo}
        columns={1}
        onSubmit={(values) => handleSave(values, editingCiclo, setEditingCiclo, () => obtenerCiclos(setCiclos))}
        initialValues={
          editingCiclo
            ? {
              nombre: editingCiclo.nombre,

            }
            : {}
        }
      />

      <Table
        id="ciclosTable"
        title="Ciclos"
        columns={columnsCiclos}
        data={ciclos}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerCiclos(setCiclos))}
            onEdit={() => setEditingCiclo(row)}
            actions={["edit", "delete"]}
          />
        )}
        headerButtons={(row) => (
          <TableButtons row={row} actions={["ciclo"]} />
        )}
      />
    </Layout>
  );
}
