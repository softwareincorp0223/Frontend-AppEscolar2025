import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerTipoMensajes, handleDelete, handleSave } from "../../functions/MensajeTipoActions";

export default function MateriasAsignacion() {
  const [tipoMensaje, setTipoMensajes] = useState([]);
  const [editingTipoMensaje, setEditingTipoMensaje] = useState(null);

  useEffect(() => {
    obtenerTipoMensajes(setTipoMensajes);
  }, []);

  const formAsignarMateria = [
    { name: "icono", label: "Profesor", type: "text", placeholder: "svg", required: true },
    { name: "icono", label: "Materia", type: "text", placeholder: "svg", required: true },
    { name: "icono", label: "Nivel", type: "text", placeholder: "svg", required: true },
    { name: "icono", label: "Grado", type: "text", placeholder: "svg", required: true },
    { name: "nombre", label: "Grupo", type: "text", placeholder: "Administrar", required: true },
  ];

  const columnsTipoMensaje = [
    { label: "Icono", key: "icono" },
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={editingTipoMensaje ? "Editar Asignar Materia" : "Asignar Materia"}
        fields={formAsignarMateria}
        columns={3}
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
