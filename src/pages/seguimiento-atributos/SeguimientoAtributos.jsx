import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAtributos, handleDelete, handleSave } from "../../functions/AtributosActions";

const STICKERS_BASE_URL = "https://ik.imagekit.io/2fqivufug/stickers";
const STICKER_FILES = [
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
];

export default function SeguimientosAtributos() {
  const [atributos, setAtributos] = useState([]);
  const [editingAtributo, setEditingAtributo] = useState(null);

  useEffect(() => {
    obtenerAtributos(setAtributos);
  }, []);

  const stickerUrl = (fileName) => `${STICKERS_BASE_URL}/${fileName}`;

  const getIconUrl = (icono) => {
    if (!icono) return "";
    if (/^https?:\/\//i.test(icono)) return icono;
    return stickerUrl(icono);
  };

  const dataConImagen = atributos.map((item) => ({
    ...item,
    icono_url: getIconUrl(item.icono),
  }));

  const stickerOptions = STICKER_FILES.map((fileName) => {
    const url = stickerUrl(fileName);
    return {
      value: url,
      label: fileName,
      image: url,
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
