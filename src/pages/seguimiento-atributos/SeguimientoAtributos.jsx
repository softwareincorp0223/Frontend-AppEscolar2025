import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAtributos, handleDelete, handleSave } from "../../functions/AtributosActions";

export default function SeguimientosAtributos() {
  const [atributos, setAtributos] = useState([]);
  const [editingAtributo, setEditingAtributo] = useState(null);

  useEffect(() => {
    obtenerAtributos(setAtributos);
  }, []);

  const images = import.meta.glob("../../assets/sticker/*.svg", {
    eager: true,
    import: "default",
  });

  const getIconUrl = (icono) => {
    const path = `../../assets/sticker/${icono}`;
    return images[path] || "";
  };

  const dataConImagen = atributos.map((item) => ({
    ...item,
    icono_url: getIconUrl(item.icono),
  }));

  const stickerOptions = Object.keys(images).map((path) => {
    const fileName = path.split("/").pop(); // 001.svg
    return {
      value: fileName,
      label: fileName,
      image: images[path],
    };
  });

  const formAtributo = [
    // { name: "icono", label: "Elije un sticker", type: "text", placeholder: "Sticker", required: true },
    {
      name: "icono",
      label: "Elije un sticker",
      type: "image-select", // 🔥 nuevo tipo
      options: stickerOptions,
      required: true,
    },
    { name: "nombre", label: "Concepto de evaluación", type: "text", placeholder: "Ej. Org", required: true },
  ];

  // const columnsAtributos = [
  //   { label: "Sticker", key: "icono" },
  //   { label: "Concepto de Evaluación", key: "nombre" },
  // ];

  const columnsAtributos = [
    {
      label: "Sticker",
      key: "icono_url",
      render: (row) => `
      <img 
        src="${row.icono_url}" 
        style="width:40px;height:40px;object-fit:contain;"
      />
    `,
    },
    { label: "Concepto de Evaluación", key: "nombre" },
  ];

  console.log(atributos);
  return (
    <Layout>
      <Form
        title={editingAtributo ? "Editar Atributo" : "Agregar Atributo"}
        fields={formAtributo}
        columns={2}
        onSubmit={(values) => handleSave(values, editingAtributo, setEditingAtributo, () => obtenerAtributos(setAtributos))}
        initialValues={
          editingAtributo
            ? {
              icono: editingAtributo.icono,
              nombre: editingAtributo.nombre,
            }
            : {}
        }
      />

      <Table
        id="atributosTable"
        title="Atributos"
        columns={columnsAtributos}
        data={dataConImagen}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() => handleDelete(row, () => obtenerAtributos(setAtributos))}
            onEdit={() => setEditingAtributo(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
