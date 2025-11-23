import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import UserDetails from "../../components/details/UserDetails";
import { obtenerUsuarios, obtenerRoles, handleDelete, handleSave } from "../../functions/UsuariosActions";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    obtenerUsuarios(setUsuarios);
    obtenerRoles(setRoles);
  }, []);

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Nombre", required: true },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Apellido", required: true },
    { name: "correo", label: "Correo", type: "email", placeholder: "Correo", required: true },
    { name: "password", label: "Contraseña", type: "password", placeholder: "******", required: true },
    {
      name: "rol",
      label: "Selecciona una opción",
      type: "select",
      options: roles.map((r) => ({ value: r.id_rol, label: r.nombre })),
      required: true,
    },
  ];

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Correo", key: "correo" },
    { label: "Rol", key: "Rol" },
  ];

  return (
    <Layout>
      <Form
        title={editingUser ? "Editar Usuario" : "Agregar Usuario"}
        fields={formFields}
        columns={3}
        onSubmit={(values) => handleSave(values, editingUser, setEditingUser, () => obtenerUsuarios(setUsuarios))}
        initialValues={
          editingUser
            ? {
                nombre: editingUser.nombre,
                apellido: editingUser.apellido,
                correo: editingUser.correo,
                password: "",
                rol: editingUser.sid_rol,
              }
            : {}
        }
      />

      {selectedUser ? (
        <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      ) : (
        <Table
          id="usuariosTable"
          title="Usuarios"
          columns={columns}
          data={usuarios}
          renderActions={(row) => (
            <ActionButtons
              row={row}
              setSelectedUser={setSelectedUser}
              onDelete={() => handleDelete(row, () => obtenerUsuarios(setUsuarios))}
              onEdit={() => setEditingUser(row)}
              actions={["view", "edit", "delete"]}
            />
          )}
        />
      )}
    </Layout>
  );
}
