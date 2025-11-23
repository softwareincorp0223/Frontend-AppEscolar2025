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


  const columnsCiclos = [
    { label: "Alumno", key: "nombre" },
    { label: "Ciclo", key: "nombre" },
    { label: "Nivel", key: "nombre" },
    { label: "Grado", key: "nombre" },
    { label: "Grupo", key: "nombre" },
  ];

  return (
    <Layout>
      <Table
        id="calificacionesTable"
        title="Calificaciones"
        columns={columnsCiclos}
        data={ciclos}
        showCheckbox={true}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerCiclos(setCiclos))}
            onEdit={() => setEditingCiclo(row)}
            actions={["pdf", "delete"]}
          />
        )}
        headerButtons={(row) => (
          <TableButtons row={row} actions={["delete", "excel"]} />
        )}
      />
    </Layout>
  );
}
