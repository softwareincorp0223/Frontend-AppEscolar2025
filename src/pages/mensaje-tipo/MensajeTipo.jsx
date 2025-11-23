import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerTipoMensajes, handleDelete, handleSave } from "../../functions/MensajeTipoActions";

export default function Ciclos() {
  const [tipoMensaje, setTipoMensajes] = useState([]);
  const [editingTipoMensaje, setEditingTipoMensaje] = useState(null);

  useEffect(() => {
    obtenerTipoMensajes(setTipoMensajes);
  }, []);

  const formTipoMensaje = [
    { name: "icono", label: "Icono", type: "text", placeholder: "svg", required: true },
    { name: "nombre", label: "Nombre tipo", type: "text", placeholder: "Administrar", required: true },
  ];

  const columnsTipoMensaje = [
    { label: "Icono", key: "icono" },
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingTipoMensaje ? "Editar Tipo Mensaje" : "Agregar Tipo Mensaje"}
        fields={formTipoMensaje}
        columns={1}
        onSubmit={(values) => handleSave(values, editingTipoMensaje, setEditingTipoMensaje, () => obtenerTipoMensajes(setTipoMensajes))}
        initialValues={
          editingTipoMensaje
            ? {
              icono: editingTipoMensaje.icono,
              nombre: editingTipoMensaje.nombre,
            }
            : {}
        }
      />

      <Table
        id="tiposMensajeTable"
        title="Tipos de Mensajes"
        columns={columnsTipoMensaje}
        data={tipoMensaje}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerTipoMensajes(setTipoMensajes))}
            onEdit={() => setEditingTipoMensaje(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
