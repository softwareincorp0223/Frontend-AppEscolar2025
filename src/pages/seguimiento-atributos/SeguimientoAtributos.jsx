import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAtributos, handleDelete, handleSave } from "../../functions/AtributosActions";

export default function SeguimientosAtributos() {
  const [atributos, setAtributos] = useState([]);
  const [editingAtributo, setEditingAtributo] = useState(null);

  useEffect(() => {
    obtenerAtributos(setAtributos);
  }, []);

  const formAtributo = [
    { name: "icono", label: "Elije un sticker", type: "text", placeholder: "Sticker", required: true },
    { name: "nombre", label: "Concepto de evaluación", type: "text", placeholder: "Ej. Org", required: true },
  ];

  const columnsAtributos = [
    { label: "Sticker", key: "icono" },
    { label: "Concepto de Evaluación", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingAtributo ? "Editar Atributo" : "Agregar Atributo"}
        fields={formAtributo}
        columns={2}
        onSubmit={(values) => handleSave(values, editingAtributo, setEditingAtributo, () => obtenerAtributos(setAtributos))}
        initialValues={
          editingAtributo
            ? {
              icono: editingAtributo.icono,
              nombre: editingAtributo.nombre,
            }
            : {}
        }
      />

      <Table
        id="atributosTable"
        title="Atributos"
        columns={columnsAtributos}
        data={atributos}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerAtributos(setAtributos))}
            onEdit={() => setEditingAtributo(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
