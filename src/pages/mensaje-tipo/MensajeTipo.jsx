import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import {
  obtenerTipoMensajes,
  handleDelete,
  handleSave,
} from "../../functions/MensajeTipoActions";

const TIPO_MENSAJE_BASE_URL = "https://ik.imagekit.io/2fqivufug/tipo_mensaje";
const TIPO_MENSAJE_FILES = [
  "001.svg",
  "002.svg",
  "003.svg",
  "004.svg",
  "005.svg",
  "006.svg",
  "007.svg",
  "008.svg",
  "009.svg",
  "010.svg",
  "011.svg",
  "012.svg",
  "013.svg",
  "014.svg",
  "015.svg",
  "016.svg",
  "017.svg",
  "018.svg",
  "019.svg",
  "020.svg",
];

export default function TipoMensajes() {
  const [tipoMensaje, setTipoMensajes] = useState([]);
  const [editingTipoMensaje, setEditingTipoMensaje] = useState(null);

  useEffect(() => {
    obtenerTipoMensajes(setTipoMensajes);
  }, []);

  const iconUrl = (fileName) => `${TIPO_MENSAJE_BASE_URL}/${fileName}`;

  const getIconUrl = (icono) => {
    if (!icono) return "";
    if (/^https?:\/\//i.test(icono)) return icono;
    return iconUrl(icono);
  };

  const dataConImagen = tipoMensaje.map((item) => ({
    ...item,
    icono_url: getIconUrl(item.icono),
  }));

  const iconOptions = TIPO_MENSAJE_FILES.map((fileName) => {
    const url = iconUrl(fileName);
    return {
      value: url,
      label: fileName,
      image: url,
    };
  });

  const formTipoMensaje = [
    {
      name: "icono",
      label: "Elige un icono",
      type: "image-select",
      options: iconOptions,
      required: true,
    },
    {
      name: "nombre",
      label: "Nombre tipo",
      type: "text",
      placeholder: "Ej. Administrativo",
      required: true,
    },
  ];

  const columnsTipoMensaje = [
    {
      label: "Icono",
      key: "icono_url",
      render: (row) => `
        <img 
          src="${row.icono_url}" 
          style="width:40px;height:40px;object-fit:contain;"
        />
      `,
    },
    { label: "Nombre", key: "nombre" },
  ];

  return (
    <Layout>
      <Form
        title={
          editingTipoMensaje
            ? "Editar Tipo Mensaje"
            : "Agregar Tipo Mensaje"
        }
        fields={formTipoMensaje}
        columns={2}
        onSubmit={(values) =>
          handleSave(
            values,
            editingTipoMensaje,
            setEditingTipoMensaje,
            () => obtenerTipoMensajes(setTipoMensajes)
          )
        }
        initialValues={
          editingTipoMensaje
            ? {
                icono: editingTipoMensaje.icono,
                nombre: editingTipoMensaje.nombre,
              }
            : {}
        }
      />

      <Table
        id="tiposMensajeTable"
        title="Tipos de Mensajes"
        columns={columnsTipoMensaje}
        data={dataConImagen}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() =>
              handleDelete(row, () => obtenerTipoMensajes(setTipoMensajes))
            }
            onEdit={() => setEditingTipoMensaje(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
