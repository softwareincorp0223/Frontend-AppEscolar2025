import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerSeguimientos, handleDelete, handleDeleteVarios } from "../../functions/SeguimientosActions";
import SeguimientoDetails from "../../components/details/SeguimientosDetails";
import { exportarExcel } from "../../functions/general/ExportarExcel";
import { obtenerAsignarAtributosExcel } from "../../functions/AsignarAtributoActions";
import DetailsContainer from "../../functions/general/DetailsContainer";
import Modal from "../../components/Modal";


export default function Seguimientos() {
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [asignarAtributoExcel, setAsignarAtributoExcel] = useState({});
  const [deleteCheck, setDeleteCheck] = useState([]);


  useEffect(() => {
    obtenerSeguimientos(setSeguimientos);
    obtenerAsignarAtributosExcel(setAsignarAtributoExcel)
  }, []);

  const columnsSeguimientos = [
    { label: "Alumno", key: "nombreAlumno" },
    { label: "Enviado", key: "enviado" },
    { label: "Visto", key: "visto" },
  ];

  const deleteVarios = () => {
    console.log("Eliminar varios:", deleteCheck);
    handleDeleteVarios(deleteCheck, setSeguimientos);
  };

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Matricula", "Nivel", "Grado", "Grupo", "Atributo", "ValorAtributo", "Observacion", "Leido", "FechaRegistro", "FechaEliminacion", "Eliminado"];
    exportarExcel("AsignarAtributo", encabezados, asignarAtributoExcel);
  };
  console.log(asignarAtributoExcel);
  
  const subirDatos = () => {
    window.location.href = "/src/pages/cargar-datos/index.html"; // redirige al dashboard
  };

  const tableHandlers = {
    excel: botonExcel,
    delete: deleteVarios,
    datos: subirDatos,
  };


  return (
    <Layout>


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
            actions={["delete", "excel", "datos"]}
            onActions={tableHandlers}
          />
        )}
        onSelectionChange={(ids) => setDeleteCheck(ids)}
      />
      <Modal
        isOpen={!!selectedExtra}
        title="Seguimiento del Alumno"
        onClose={() => setSelectedExtra(null)}
      >
        {selectedExtra && (
          <SeguimientoDetails
            alumno={selectedExtra}
            onClose={() => setSelectedExtra(null)}
          />
        )}
      </Modal>

      {/* <DetailsContainer visible={!!selectedExtra} top={650}>
        <SeguimientoDetails
          alumno={selectedExtra}
          onClose={() => setSelectedExtra(null)}
        />
      </DetailsContainer> */}
    </Layout>
  );
}
