import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerSeguimientos,handleDelete } from "../../functions/SeguimientosActions";

export default function Seguimientos() {
  const [seguimientos, setSeguimientos] = useState([]);

  useEffect(() => {
    obtenerSeguimientos(setSeguimientos);
  }, []);

  const columnsSeguimientos = [
    { label: "Alumno", key: "nombreAlumno" },
    { label: "Enviado", key: "enviado" },
    { label: "Visto", key: "visto" },
  ];

  return (
    <Layout>

      <Table
        id="seguimientosTable"
        title="Seguimientos"
        columns={columnsSeguimientos}
        data={seguimientos}
        showCheckbox={true}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerSeguimientos(setSeguimientos))}
            // onEdit={() => setEditingAtributo(row)}
            actions={["view", "delete"]}
          />
        )}
        headerButtons={(row) => (
          <TableButtons row={row} actions={["delete","excel"]} />
        )}
      />
    </Layout>
  );
}
