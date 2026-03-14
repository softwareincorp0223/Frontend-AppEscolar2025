import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerNiveles, handleDelete, handleSave } from "../../functions/NivelesActions";
import { obtenerGrados, handleDeleteGrados, handleSaveGrados, obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGrupos, handleDeleteGrupos, handleSaveGrupos } from "../../functions/GruposActions";

export default function Niveles() {

  // TABLAS
  const [niveles, setNiveles] = useState([]);
  const [editingNivel, setEditingNivel] = useState(null);

  const [grados, setGrados] = useState([]);
  const [editingGrado, setEditingGrado] = useState(null);

  const [grupos, setGrupos] = useState([]);
  const [editingGrupo, setEditingGrupo] = useState(null);

  // FORM GRUPOS (dependientes)
  const [gradosPorNivel, setGradosPorNivel] = useState([]);
  const [gruposPorGrado, setGruposPorGrado] = useState([]);

  // selects
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

  useEffect(() => {
    obtenerNiveles(setNiveles);
    obtenerGrados(setGrados);
    obtenerGrupos(setGrupos);
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGradosPorNivel);
    } else {
      setGradosPorNivel([]);
    }
  }, [nivelSeleccionado]);


  useEffect(() => {
    if (!editingGrupo) return;

    const nivel = editingGrupo.Grado?.sid_nivel;

    setNivelSeleccionado(nivel);

    obtenerGradosPorNivel(nivel, (res) => {
      setGradosPorNivel(res);
    });

  }, [editingGrupo]);


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

  // FORM DE GRUPOS


  const formFieldsGrupo = useMemo(
    () => [
      {
        name: "Nivel",
        label: "Nivel",
        type: "select",
        options: niveles.map((r) => ({
          value: r.id_nivel,
          label: r.nombre,
        })),
        required: true,
        onChange: (e) => setNivelSeleccionado(e.target.value),
      },
      {
        name: "Grado",
        label: "Grado",
        type: "select",
        options: gradosPorNivel.map((g) => ({
          value: g.id_grado,
          label: g.nombre,
        })),
        required: true,
      },
      {
        name: "nombre",
        label: "Grupo",
        type: "input",
      },
    ],
    [niveles, gradosPorNivel]
  );


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
                    Nivel: editingGrupo.Grado?.sid_nivel,
                    Grado: editingGrupo.sid_grado,
                    nombre: editingGrupo.nombre,
                  }
                  : {}
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
