import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerNiveles, handleDelete, handleSave } from "../../functions/NivelesActions";
import { obtenerGrados, handleDeleteGrados, handleSaveGrados } from "../../functions/GradosActions";
import { obtenerGrupos, handleDeleteGrupos, handleSaveGrupos } from "../../functions/GruposActions";
import { SelectField } from "../../functions/general/Select";

export default function Niveles() {
  const [niveles, setNiveles] = useState([]);
  const [editingNivel, setEditingNivel] = useState(null);

  const [grados, setGrados] = useState([]);
  const [editingGrado, setEditingGrado] = useState(null);

  const [grupos, setGrupos] = useState([]);
  const [editingGrupo, setEditingGrupo] = useState(null);

  const [gradoFiltrado, setGradoFiltrado] = useState([]);


  useEffect(() => {
    obtenerNiveles(setNiveles);
    obtenerGrados(setGrados);
    obtenerGrupos(setGrupos);
  }, []);

  // 🔹 Filtrar grados según nivel

  const filtrarGradosPorNivel = (idNivel) => {
    const filtrados = grados.filter(
      (g) => String(g.sid_nivel) === String(idNivel)
    );
    setGradoFiltrado(filtrados);
  };

  // 🔹 sincronizar edición


  useEffect(() => {
    if (editingGrupo && grados.length > 0) {
      // setNivelSeleccionado(editingGrupo.sid_nivel);
      filtrarGradosPorNivel(editingGrupo.Grado.sid_nivel);
      // setGradoSeleccionado(editingGrupo.sid_grado);
    }
  }, [editingGrupo, grados]);

  const formFieldsNiveles = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Ej. Primaria",
      required: true,
    },
  ];

  const formFieldsGrado = [
    {
      name: "nombreNivel",
      label: "Selecciona una opción",
      type: "select",
      options: niveles.map((r) => ({
        value: r.id_nivel,
        label: r.nombre,
      })),
      required: true,
    },
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Ej. Primero",
      required: true,
    },
  ];

  // FORM DE GRUPOS — CORREGIDO

  const formFieldsGrupo = [
    {
      name: "sid_nivel",
      label: "Selecciona un nivel",
      type: "custom",
      component: (props) => (
        <SelectField
          name={props.name}
          value={props.value}
          error={props.error}
          options={niveles.map((r) => ({
            value: String(r.id_nivel),
            label: r.nombre,
          }))}
          onChange={(value) => {
            // siempre primero el form
            props.onChange(value);

            // lógica dependiente
            filtrarGradosPorNivel(value);

            // limpiar grado SOLO en creación
            if (!editingGrupo) {
              props.setFormValues((prev) => ({
                ...prev,
                sid_grado: "",
              }));
            }
          }}
        />
      ),
      required: true,
    },
    {
      name: "sid_grado",
      label: "Selecciona un grado",
      type: "custom",
      component: (props) => (
        <SelectField
          name={props.name}
          value={props.value}
          error={props.error}
          options={gradoFiltrado.map((r) => ({
            value: String(r.id_grado),
            label: r.nombre,
          }))}
          onChange={props.onChange}
          disabled={gradoFiltrado.length === 0}
        />
      ),
      required: true,
    },
    {
      name: "nombre",
      label: "Grupo",
      type: "text",
      placeholder: "Ej. A",
      required: true,
    },
  ];


  const columnsNiveles = [{ label: "Nombre", key: "nombre" }];
  const columnsGrados = [
    { label: "Nivel", key: "nombreNivel" },
    { label: "Nombre", key: "nombre" },
  ];
  const columnsGrupos = [
    { label: "Nivel", key: "nombreNivel" },
    { label: "Grado", key: "nombreGrado" },
    { label: "Nombre", key: "nombre" },
  ];


  console.log(editingGrupo);
  return (
    <Layout>
      <div className="container-fluid py-4 py-lg-4">
        <div className="row g-4 g-lg-4">
          {/* NIVELES */}
          <div className="col-lg-6">
            <Form
              title={editingNivel ? "Editar Nivel" : "Agregar Nivel"}
              fields={formFieldsNiveles}
              columns={1}
              onSubmit={(values) =>
                handleSave(values, editingNivel, setEditingNivel, () =>
                  obtenerNiveles(setNiveles)
                )
              }
              initialValues={editingNivel ? { nombre: editingNivel.nombre } : {}}
            />
            <Table
              title="Niveles"
              columns={columnsNiveles}
              data={niveles}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  onDelete={() =>
                    handleDelete(row, () => obtenerNiveles(setNiveles))
                  }
                  onEdit={() => setEditingNivel(row)}
                  actions={["edit", "delete"]}
                />
              )}
            />
          </div>

          {/* GRADOS */}
          <div className="col-lg-6">
            <Form
              title={editingGrado ? "Editar Grado" : "Agregar Grado"}
              fields={formFieldsGrado}
              columns={1}
              onSubmit={(values) =>
                handleSaveGrados(values, editingGrado, setEditingGrado, () =>
                  obtenerGrados(setGrados)
                )
              }
              initialValues={
                editingGrado
                  ? {
                    nombreNivel: editingGrado.sid_nivel,
                    nombre: editingGrado.nombre,
                  }
                  : {}
              }
            />
            <Table
              title="Grados"
              columns={columnsGrados}
              data={grados}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  onDelete={() =>
                    handleDeleteGrados(row, () => obtenerGrados(setGrados))
                  }
                  onEdit={() => setEditingGrado(row)}
                  actions={["edit", "delete"]}
                />
              )}
            />
          </div>

          {/* GRUPOS */}
          <div className="col-lg-12">
            <Form
              title={editingGrupo ? "Editar Grupo" : "Agregar Grupo"}
              fields={formFieldsGrupo}
              columns={3}
              onSubmit={(values) =>
                handleSaveGrupos(values, editingGrupo, setEditingGrupo, () =>
                  obtenerGrupos(setGrupos)
                )
              }
              initialValues={
                editingGrupo
                  ? {
                    sid_nivel: editingGrupo.Grado.sid_nivel,
                    sid_grado: editingGrupo.sid_grado,
                    nombre: editingGrupo.nombre,
                  }
                  : null
              }
            />
            <Table
              title="Grupos"
              columns={columnsGrupos}
              data={grupos}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  onDelete={() =>
                    handleDeleteGrupos(row, () => obtenerGrupos(setGrupos))
                  }
                  onEdit={() => setEditingGrupo(row)}
                  actions={["edit", "delete"]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
