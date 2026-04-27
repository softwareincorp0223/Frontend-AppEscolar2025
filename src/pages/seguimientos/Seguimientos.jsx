import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerSeguimientos, handleDelete } from "../../functions/SeguimientosActions";
import SeguimientoDetails from "../../components/details/SeguimientosDetails";
import { exportarExcel } from "../../functions/general/exportarExcel";
import { obtenerAsignarAtributosExcel } from "../../functions/AsignarAtributoActions";


export default function Seguimientos() {
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [asignarAtributoExcel, setAsignarAtributoExcel] = useState({});


  useEffect(() => {
    obtenerSeguimientos(setSeguimientos);
    obtenerAsignarAtributosExcel(setAsignarAtributoExcel)
  }, []);

  const columnsSeguimientos = [
    { label: "Alumno", key: "nombreAlumno" },
    { label: "Enviado", key: "enviado" },
    { label: "Visto", key: "visto" },
  ];

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Matricula", "Nivel", "Grado", "Grupo",  "Atributo", "ValorAtributo" , "Observacion", "Leido", "FechaRegistro", "FechaEliminacion", "Eliminado"];
    exportarExcel("AsignarAtributo", encabezados, asignarAtributoExcel);
  };
  console.log(asignarAtributoExcel);

  const tableHandlers = {
    excel: botonExcel,
  };


  return (
    <Layout>

      {selectedExtra ? (
        <SeguimientoDetails alumno={selectedExtra} onClose={() => setSelectedExtra(null)} />

      ) : (
        <Table
          id="seguimientosTable"
          title="Seguimientos"
          columns={columnsSeguimientos}
          data={seguimientos}
          showCheckbox={true}
          renderActions={
            (row) => (
              <ActionButtons
                row={row}
                setSelectedUser={setSelectedExtra}
                onDelete={() => handleDelete(row, () => obtenerSeguimientos(setSeguimientos))
                }
                actions={["view", "delete"]}
              />
            )}
          headerButtons={(row) => (
            <TableButtons
              row={row}
              actions={["delete", "excel"]}
              onActions={tableHandlers}
            />
          )}
        />
      )}

    </Layout>
  );
}
