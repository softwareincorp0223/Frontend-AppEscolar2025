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

export default function TipoMensajes() {
  const [tipoMensaje, setTipoMensajes] = useState([]);
  const [editingTipoMensaje, setEditingTipoMensaje] = useState(null);

  useEffect(() => {
    obtenerTipoMensajes(setTipoMensajes);
  }, []);

  const images = import.meta.glob("../../assets/Tipo mensaje/*.svg", {
    eager: true,
    import: "default",
  });

  const getIconUrl = (icono) => {
    const path = `../../assets/Tipo mensaje/${icono}`;
    return images[path] || "";
  };

  const dataConImagen = tipoMensaje.map((item) => ({
    ...item,
    icono_url: getIconUrl(item.icono),
  }));

  const iconOptions = Object.keys(images).map((path) => {
    const fileName = path.split("/").pop();

    return {
      value: fileName,
      label: fileName,
      image: images[path],
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