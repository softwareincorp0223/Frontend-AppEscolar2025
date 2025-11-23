

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerTipoMensajesHistorial} from "../../functions/MensajeTipoActions";

export default function MensajeHistorial() {
  const [historialMensaje, setHistorialMensajes] = useState([]);

  useEffect(() => {
    obtenerTipoMensajesHistorial(setHistorialMensajes);
  }, []);

  const columnsHistorialMensaje = [
    { label: "Alumno", key: "id_mensaje" },
    { label: "Nivel", key: "id_mensaje" },
  ];
  console.log(historialMensaje);
  return (
    <Layout>
      <Table
        id="historialMensajeTable"
        title="Hitorial de Mensajes"
        columns={columnsHistorialMensaje}
        data={historialMensaje}
      />
    </Layout>
  );
}
