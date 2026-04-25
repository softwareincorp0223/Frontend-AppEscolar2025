import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerEvaluacion, handleDelete } from "../../functions/EvaluacionActions";

export default function Calificaciones() {
  const [evaluacion, setEvaluacion] = useState([]);
  const [editingCiclo, setEditingCiclo] = useState(null);

  useEffect(() => {
    obtenerEvaluacion(setEvaluacion);
  }, []);


  const columnsEvaluacion = [
    { label: "Alumno", key: "alumno" },
    { label: "Ciclo", key: "ciclo" },
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
  ];

  return (
    <Layout>
      <Table
        id="calificacionesTable"
        title="Calificaciones"
        columns={columnsEvaluacion}
        data={evaluacion}
        showCheckbox={true}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerEvaluacion(setEvaluacion))}
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
