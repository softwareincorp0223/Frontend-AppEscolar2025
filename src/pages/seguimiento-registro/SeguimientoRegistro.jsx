import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";

import { obtenerSeguimientosEliminados } from "../../functions/SeguimientosActions";

export default function SeguimientoRegistros() {
  const [seguimientosEliminados, setSeguimientosDelete] = useState([]);


  useEffect(() => {
    obtenerSeguimientosEliminados(setSeguimientosDelete);
  }, []);


  const columnsSeguimientos = [
    { label: "Estudiante", key: "nombreAlumno" },
    { label: "Enviado", key: "fecha_registro" },
    { label: "Visto", key: "fecha_visto" },
    { label: "Responsable", key: "nombreAlumno" },
    { label: "Fecha Eliminación", key: "fecha_eliminacion" },
  ];

  return (
    <Layout>

      <Table
        id="seguimientosDeleteTable"
        title="Seguimientos Eliminados"
        columns={columnsSeguimientos}
        data={seguimientosEliminados}
        
      />
    </Layout>
  );
}
