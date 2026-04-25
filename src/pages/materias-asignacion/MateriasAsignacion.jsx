import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import { obtenerMateriasAsignadas } from "../../functions/MateriasActions";

import {
  handleDelete,
  handleDeleteAsignacion,
  handleSaveAsignacion,
} from "../../functions/MateriasActions";
import { obtenerMaterias } from "../../functions/MateriasActions";
import { obtenerUsuarios } from "../../functions/UsuariosActions";

export default function MateriasAsignacion() {
  const [materias, setMaterias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingAsignaMaterias, setEditingAsignarMaterias] = useState(null);

  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  //falta el editar y el eliminar##########################

  useEffect(() => {
    obtenerMaterias(setMaterias);
    obtenerUsuarios(setUsuarios);
    obtenerNiveles(setNiveles);
    obtenerMateriasAsignadas(setMateriasAsignadas);
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGrados);
      setGrupos([]);
      setGradoSeleccionado(null);
    }
  }, [nivelSeleccionado]);

  useEffect(() => {
    if (gradoSeleccionado) {
      obtenerGruposPorGrados(gradoSeleccionado, setGrupos);
    }
  }, [gradoSeleccionado]);

  const formAsignarMateria = [
    {
      name: "profesor",
      label: "Seleccione  Profesor",
      type: "select",
      required: true,
      options: usuarios.map((u) => ({ value: u.id_usuario, label: u.nombre })),
    },
    {
      name: "materia",
      label: "Seleccione  Materia",
      type: "select",
      required: true,
      options: materias.map((m) => ({ value: m.id_materia, label: m.nombre })),
    },
    {
      name: "Nivel",
      label: "Nivel",
      type: "select",
      options: niveles.map((r) => ({
        value: r.id_nivel,
        label: r.nombre,
      })),
      required: false,
      onChange: (e) => setNivelSeleccionado(e.target.value),
    },
    {
      name: "Grado",
      label: "Grado",
      type: "select",
      options: grados.map((g) => ({
        value: g.id_grado,
        label: g.nombre,
      })),
      required: false,
      onChange: (e) => setGradoSeleccionado(e.target.value),
    },
    {
      name: "Grupo",
      label: "Grupo",
      type: "select",
      options: grupos.map((g) => ({
        value: g.id_grupo,
        label: g.nombre,
      })),
      required: false,
    },
  ];

  const columnsMateriasAsignadas = [
    { label: "Nivel - Grado - Grupo", key: "nivelGradoGrupo" },
    { label: "Materia", key: "nombre_materia" },
    { label: "Profesor", key: "profesor" },
    { label: "Creado", key: "creacion" },
  ];

  const resetFormulario = () => {
    setMaterias([]);
    setNivelSeleccionado(null);
    setGradoSeleccionado(null);
    setUsuarios([]);
    setNiveles([]);
    setGrupos([]);
    setGrados([]);
  };

  return (
    <Layout>
      <Form
        title={
          editingAsignaMaterias ? "Editar Asignar Materia" : "Asignar Materia"
        }
        fields={formAsignarMateria}
        columns={3}
        onSubmit={(values) =>
          handleSaveAsignacion(
            values,
            editingAsignaMaterias,
            setEditingAsignarMaterias,
            () => obtenerMateriasAsignadas(setMateriasAsignadas),
                resetFormulario(),

          )
        }
        initialValues={
          editingAsignaMaterias
            ? {
                profesor: editingAsignaMaterias.sid_usuario,
                materia: editingAsignaMaterias.sid_materia,
                Nivel: editingAsignaMaterias.sid_nivel,
                Grado: editingAsignaMaterias.sid_grado,
                Grupo: editingAsignaMaterias.sid_grupo,
              }
            : {}
        }
      />

      <Table
        id="materiasAsignadasTable"
        title="Materias Asignadas"
        columns={columnsMateriasAsignadas}
        data={materiasAsignadas}
        renderActions={(row) => (
          <ActionButtons
            row={row}
            onDelete={() =>
              handleDelete(
                row,
                () => obtenerMateriasAsignadas(setMateriasAsignadas),
              )
            }
            onEdit={() => setEditingAsignarMaterias(row)}
            actions={["edit", "delete"]}
          />
        )}
      />
    </Layout>
  );
}
