import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import {
  obtenerAlumnos,
  handleSaveAlumnos,
  handleDeleteVarios,
  handleDelete,
  descargarQRsAlumnos,
} from "../../functions/EstudiantesActions";
import { filtrarTabla } from "../../functions/general/Functions";
import EstudianteDetails from "../../components/details/EstudiantesDetails";
import Form from "../../components/Form";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import { obtenerPadres } from "../../functions/PadresActions";
import { exportarExcel } from "../../functions/general/exportarExcel";
import Modal from "../../components/Modal";
import { showAlert } from "../../functions/general/Alerts";

export default function Estudiantes() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosOriginal, setAlumnosOriginal] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [deleteCheck, setDeleteCheck] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);

  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [padres, setPadres] = useState([]);

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  /* =========================
     CARGA INICIAL
  ========================== */
  useEffect(() => {
    obtenerAlumnos((res) => {
      setAlumnosOriginal(res);
      setAlumnos(res);
    }).finally(() => setLoadingAlumnos(false));
    obtenerNiveles(setNiveles);
    obtenerPadres(setPadres);
  }, []);

  /* =========================
     SELECTS DEPENDIENTES
  ========================== */
  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGrados);
      setGrupos([]);
      setGradoSeleccionado(null);
    }
  }, [nivelSeleccionado]);
  console.log(editing);

  useEffect(() => {
    if (gradoSeleccionado) {
      obtenerGruposPorGrados(gradoSeleccionado, setGrupos);
    }
  }, [gradoSeleccionado]);

  useEffect(() => {
    if (editing) {
      setNivelSeleccionado(editing.sid_nivel);
      setGradoSeleccionado(editing.sid_grado);

      // Cargar grados y grupos automáticamente
      obtenerGradosPorNivel(editing.sid_nivel, (resGrados) => {
        setGrados(resGrados);

        obtenerGruposPorGrados(editing.sid_grado, setGrupos);
      });
    }
  }, [editing]);

  /* =========================
     FILTROS
  ========================== */
  const manejarCambioFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: alumnosOriginal,
    });
    setAlumnos(resultado);
  };

  /* =========================
     TABLA
  ========================== */
  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Nivel", key: "Nivel" },
    { label: "Grado", key: "Grado" },
    { label: "Grupo", key: "Grupo" },
  ];

  const deleteVarios = () => {
    handleDeleteVarios(deleteCheck, setAlumnos);
  };

  const botonExcel = () => {
    console.log("Exportando Excel...");
    const encabezados = ["Nombre", "Apellido", "Nivel", "Grado", "Grupo"];
    exportarExcel("AlumnosInstituto", encabezados, alumnos);
  };

  const tableHandlers = {
    delete: deleteVarios,
    excel: botonExcel,
    qr_code: descargarQRsAlumnos,
  };

  /* =========================
     CAMPOS DEL FORMULARIO
  ========================== */
  const formFields = useMemo(
    () => [
      {
        name: "nombre",
        label: "Nombre",
        type: "text",
        required: true,
      },
      {
        name: "apellido",
        label: "Apellido",
        type: "text",
        required: true,
      },
      {
        name: "matricula",
        label: "Matrícula",
        type: "text",
        required: true,
      },
      {
        name: "Sexo",
        label: "Sexo",
        type: "select",
        options: ["Masculino", "Femenino", "Otro"].map((r) => ({
          value: r,
          label: r,
        })),
        required: true,
      },
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
        options: grados.map((g) => ({
          value: g.id_grado,
          label: g.nombre,
        })),
        required: true,
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
        required: true,
      },
      {
        name: "Padre",
        label: "Padre",
        type: "select",
        select2: true,
        options: padres.map((r) => ({
          value: String(r.id_padre),
          label: r.nombre + " " + r.apellido,
        })),
        required: true,
      },
      {
        name: "imagen",
        label: "Imagen",
        type: "file",
        accept: "image/*",
        required: false
      }
    ],
    [niveles, grados, grupos, padres],
  );

  const resetFormulario = () => {
    setEditing(null); // 🔥 salir de modo edición
    setNivelSeleccionado(null); // limpiar selects dependientes
    setGradoSeleccionado(null);
    setGrados([]);
    setGrupos([]);
  };

  /* =========================
     INITIAL VALUES ESTABLES
  ========================== */
  const initialFormValues = useMemo(() => editing || {}, [editing]);

  return (
    <Layout>
      <div className="container-fluid pb-4">
        <Form
          key={editing ? editing.id : "new"}
          title={editing ? "Editar Estudiante" : "Agregar Estudiante"}
          fields={formFields}
          columns={3}
          onSubmit={async (values) => {
            try {
              await handleSaveAlumnos(values, editing, setEditing, () => {
                obtenerAlumnos(setAlumnos);
                resetFormulario();
              });
            } catch (error) {
              showAlert("error", error.message);
              throw error;
            }
          }}
          initialValues={
            editing
              ? {
                  nombre: editing.nombre,
                  apellido: editing.apellido,
                  matricula: editing.matricula,
                  Sexo: editing.sexo,
                  Nivel: nivelSeleccionado || editing.sid_nivel,
                  Grado: gradoSeleccionado || editing.sid_grado,
                  Grupo: editing.sid_grupo,
                  Padre: String(editing.sid_padre),
                }
              : {}
          }
        />

        <Filter
          enabledFilters={["buscar", "nivel", "grado", "grupo"]}
          nombreFiltro="Estudiantes"
          onFilterChange={manejarCambioFiltros}
        />

        <Table
          id="alumnosTable"
          title="Alumnos"
          columns={columns}
          data={alumnos}
          showCheckbox
          loading={loadingAlumnos}
          renderActions={(row) => (
            <ActionButtons
              row={row}
              setSelectedUser={setSelectedEstudiante}
              onEdit={() => setEditing(row)}
              onDelete={() => handleDelete(row, setAlumnos)}
              actions={["view", "edit", "delete"]}
            />
          )}
          headerButtons={(row) => (
            <TableButtons
              row={row}
              actions={["delete", "excel", "qr_code"]}
              onActions={tableHandlers}
            />
          )}
          onSelectionChange={(ids) => setDeleteCheck(ids)}
        />

        <Modal
          isOpen={!!selectedEstudiante}
          title="Detalle del estudiante"
          onClose={() => setSelectedEstudiante(null)}
        >
          {selectedEstudiante && (
            <EstudianteDetails
              estudiante={selectedEstudiante}
              onClose={() => setSelectedEstudiante(null)}
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
}
