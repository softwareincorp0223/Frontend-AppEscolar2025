import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerEvaluacion, handleDelete, obtenerCalificacionesExcel, handleDeleteVarios, generarPdfCalificacion } from "../../functions/EvaluacionActions";
import { exportarExcel } from "../../functions/general/exportarExcel";


export default function Calificaciones() {
  const [evaluacion, setEvaluacion] = useState([]);
  const [editingCiclo, setEditingCiclo] = useState(null);
  const [calificacionesExcel, setCalificacionesExcel] = useState({});
  const [deleteCheck, setDeleteCheck] = useState([]);



  useEffect(() => {
    obtenerEvaluacion(setEvaluacion);
    obtenerCalificacionesExcel(setCalificacionesExcel);
  }, []);

  const deleteVarios = () => {
    console.log("Eliminar varios:", deleteCheck);
    handleDeleteVarios(deleteCheck, setEvaluacion);
  };

  const columnsEvaluacion = [
    { label: "Alumno", key: "alumno" },
    { label: "Ciclo", key: "ciclo" },
    { label: "Nivel", key: "nivel" },
    { label: "Grado", key: "grado" },
    { label: "Grupo", key: "grupo" },
  ];

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Matricula", "Nivel", "Grado", "Grupo", "Promedio_general", "Promedio_final", "Ciclo", "Materia", "Calificacion", "Periodo"];
    exportarExcel("Calificaciones", encabezados, calificacionesExcel);
  };
  console.log(evaluacion);

  const tableHandlers = {
    delete: deleteVarios,
    excel: botonExcel,
  };

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
            PdfData={() => generarPdfCalificacion(row)}
            actions={["pdf", "delete"]}
          />
        )}
        headerButtons={(row) => (
          <TableButtons
            row={row}
            actions={["delete", "excel"]}
            onActions={tableHandlers}
          />
        )}
        onSelectionChange={(ids) => setDeleteCheck(ids)}
      />
    </Layout>
  );
}
