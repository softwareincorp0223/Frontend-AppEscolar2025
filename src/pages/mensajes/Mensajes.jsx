import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import $ from "jquery";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import {
  obtenerMensajes,
  obtenerMensajesExcel,
  handleSaveMensaje,
  handleDeleteVarios,
  handleDelete
} from "../../functions/MensajeActions";
import { exportarExcel } from "../../functions/general/ExportarExcel";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerTipoMensajes } from "../../functions/MensajeTipoActions";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import CustomSelect from "../../components/CustomSelect";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";
import { obtenerExtracurricular } from "../../functions/ExtracurricularActions";
import MensajeForm from "../../components/custom/mensajes/MensajesForm";
import MensajeDetails from "../../components/details/MensajesDetails";
import DetailsContainer from "../../functions/general/DetailsContainer";

export default function Mensaje() {
  const [mensajes, setMensajes] = useState([]);
  const [mensajesOriginal, setMensajesOriginal] = useState([]);
  const [mensajesExcel, setMensajesExcel] = useState([]);
  const [mensajesTipo, setMensajesTipo] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [extracurriculares, setExtracurriculares] = useState([]);
  const [selectedMensaje, setSelectedMensaje] = useState(null);
  const [deleteCheck, setDeleteCheck] = useState([]);

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  const [formData, setFormData] = useState({
    receptor: "0",
    sid_tipo: "0",
    sid_estudiante: "0",
    sid_nivel: "0",
    sid_grado: "0",
    sid_grupo: "0",
    sid_extracurricular: "0",
    asunto_mensaje: "",
    mensaje: "",
    respuesta_rapida_mensaje: false,
    programado_mensaje: false,
    fecha_envio_mensaje: "",
    hora_envio_mensaje: "",
    repetir_mensaje: false,
    periodo_mensaje: "",
    fecha_fin_mensaje: "",
    archivos: [null],
    urls: [""],
    repetir_mensaje: false,
  });

  const manejarMensajesFiltros = (f) => {
    const resultado = filtrarTabla({
      filtros: f,
      dataOriginal: mensajesOriginal,
    });
    setMensajes(resultado);
  };

  useEffect(() => {
    obtenerMensajes((res) => {
      setMensajesOriginal(res);
      setMensajes(res);
    });
    obtenerMensajesExcel(setMensajesExcel);
    obtenerNiveles(setNiveles);
    obtenerTipoMensajes(setMensajesTipo);
    obtenerAlumnos(setAlumnos);
    obtenerExtracurricular(setExtracurriculares);
  }, []);

  useEffect(() => {
    if (formData.sid_nivel !== "0") {
      obtenerGradosPorNivel(formData.sid_nivel, setGrados);
      setGrupos([]);

      setFormData((prev) => ({
        ...prev,
        sid_grado: "0",
        sid_grupo: "0",
      }));
    }
  }, [formData.sid_nivel]);

  useEffect(() => {
    if (formData.sid_grado !== "0") {
      obtenerGruposPorGrados(formData.sid_grado, setGrupos);

      setFormData((prev) => ({
        ...prev,
        sid_grupo: "0",
      }));
    }
  }, [formData.sid_grado]);

  const columns = [
    { label: "Receptor", key: "receptor" },
    { label: "Envio", key: "nombre_tipo" },
    { label: "Num Destinatario", key: "destinatarios" },
    { label: "Asunto", key: "asunto" },
    { label: "Fecha", key: "fecha_de_envio" },
  ];

  const handleSubmit = async (formData) => {
    const guardado = await handleSaveMensaje(formData);

    if (guardado) {
      obtenerMensajes((res) => {
        setMensajesOriginal(res);
        setMensajes(res);
      });
      obtenerMensajesExcel(setMensajesExcel);
    }

    return guardado;
  };

  const botonExcel = () => {
    const encabezados = ["Receptor", "Envio", "NumDestinatario", "Asunto", "Fecha"];
    exportarExcel("Mensajes", encabezados, mensajesExcel);
  };

  const deleteVarios = () => {
    handleDeleteVarios(deleteCheck, setMensajes);
  };

  const tableHandlers = {
    delete: deleteVarios,
    excel: botonExcel,
  };

  return (
    <Layout>
      <div className="container mt-2"></div>

      {/* Contenido */}
      <div
        className="container-fluid py-4 py-lg-4"
        style={{ paddingLeft: "3px" }}
      >
        <div className="row g-4 g-lg-4">
          <div className="col-lg-12">
            <div className="card mb-4 ">
              <div className="card-body">
                <MensajeForm
                  mensajesTipo={mensajesTipo}
                  niveles={niveles}
                  grados={grados}
                  grupos={grupos}
                  alumnos={alumnos}
                  extracurriculares={extracurriculares}
                  obtenerGradosPorNivel={(id) =>
                    obtenerGradosPorNivel(id, setGrados)
                  }
                  obtenerGruposPorGrados={(id) =>
                    obtenerGruposPorGrados(id, setGrupos)
                  }
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            <Filter
              enabledFilters={["buscar", "rango"]}
              nombreFiltro="Mensajes"
              onFilterChange={manejarMensajesFiltros}
            />

            <Table
              id="mensajesTable"
              title="Mensajes"
              columns={columns}
              data={mensajes}
              showCheckbox={true}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  onDelete={() =>
                    handleDelete(row, () => obtenerMensajes(setMensajes))
                  }
                  actions={["view", "delete"]}
                  setSelectedUser={setSelectedMensaje}
                />
              )}
              headerButtons={(row) => (
                <TableButtons
                  row={row}
                  actions={["delete", "excel"]}
                  onActions={tableHandlers}
                />
              )}
              onSelectionChange={(ids) => setDeleteCheck(ids)}
            />

            <DetailsContainer visible={!!selectedMensaje} top={650}>
              <MensajeDetails
                mensaje={selectedMensaje}
                onClose={() => setSelectedMensaje(null)}
              />
            </DetailsContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
