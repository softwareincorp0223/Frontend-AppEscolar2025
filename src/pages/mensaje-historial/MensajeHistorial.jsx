import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import { obtenerMensajesHistorial} from "../../functions/MensajeTipoActions";

export default function MensajeHistorial() {
  const [historialMensaje, setHistorialMensajes] = useState([]);

  useEffect(() => {
    obtenerMensajesHistorial(setHistorialMensajes);
  }, []);

  const columnsHistorialMensaje = [
    { label: "Emisor", key: "nombre_instituto" },
    { label: "Receptor", key: "receptor" },
    { label: "Destinatario", key: "destinatario" },
    { label: "Fecha de envio", key: "fecha_envio" },
    { label: "Tipo mensaje", key: "tipo_mensaje" },
  ];

  return (
    <Layout>
      <Table
        id="historialMensajeTable"
        title="Historial de Mensajes"
        columns={columnsHistorialMensaje}
        data={historialMensaje}
      />
    </Layout>
  );
}
