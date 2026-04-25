import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import $ from "jquery";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";
import { obtenerMensajes } from "../../functions/MensajeActions";
import { filtrarTabla } from "../../functions/general/Functions";
import { obtenerTipoMensajes } from "../../functions/MensajeTipoActions";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import CustomSelect from "../../components/CustomSelect";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";
import { obtenerExtracurricular } from "../../functions/ExtracurricularActions";

export default function Mensaje() {
  const [mensajes, setMensajes] = useState([]);
  const [mensajesOriginal, setMensajesOriginal] = useState([]);
  const [mensajesTipo, setMensajesTipo] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [extracurriculares, setExtracurriculares] = useState([]);

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
    obtenerNiveles(setNiveles);
    obtenerTipoMensajes(setMensajesTipo);
    obtenerAlumnos(setAlumnos);
    obtenerExtracurricular(setExtracurriculares);
  }, []);
  console.log("mensajes:", mensajes);

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

  /*useEffect(() => {
    //  Inicializar solo si no está ya inicializada
    if (!$.fn.DataTable.isDataTable("#mensajesTable")) {
      $("#mensajesTable").DataTable();
    }

    return () => {
      //  Destruir solo al desmontar el componente
      if ($.fn.DataTable.isDataTable("#mensajesTable")) {
        $("#mensajesTable").DataTable().destroy();
      }
    };
  }, []);*/

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Manejo de URLs
  const addUrlField = () => {
    if (formData.urls.length < 5) {
      setFormData({ ...formData, urls: [...formData.urls, ""] });
    }
  };

  const removeUrlField = (index) => {
    setFormData({
      ...formData,
      urls: formData.urls.filter((_, i) => i !== index),
    });
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData({ ...formData, urls: newUrls });
  };

  // Manejo de Archivos
  const addFileField = () => {
    if (formData.archivos.length < 5) {
      setFormData({ ...formData, archivos: [...formData.archivos, null] });
    }
  };

  const removeFileField = (index) => {
    setFormData({
      ...formData,
      archivos: formData.archivos.filter((_, i) => i !== index),
    });
  };

  const handleArchivoChange = (index, file) => {
    const newArchivos = [...formData.archivos];
    newArchivos[index] = file;
    setFormData({ ...formData, archivos: newArchivos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí envías formData a tu API con Axios o fetch
  };

  const renderReceptorFields = () => {
    switch (formData.receptor) {
      case "1": // Estudiantes
        return (
          <CustomSelect
            label="Estudiante"
            name="sid_estudiante"
            value={formData.sid_estudiante}
            onChange={handleChange}
            options={alumnos}
            optionValue="id_estudiante"
            optionLabel="nombre"
            placeholder="Selecciona estudiante"
          />
        );

      case "2": // Nivel → Grado → Grupo
        return (
          <div className="row mt-3">
            <div className="col-lg-4">
              <CustomSelect
                label="Nivel"
                name="sid_nivel"
                value={formData.sid_nivel}
                onChange={handleChange}
                options={niveles}
                optionValue="id_nivel"
                optionLabel="nombre"
                placeholder="Selecciona nivel"
              />
            </div>

            <div className="col-lg-4">
              <CustomSelect
                label="Grado"
                name="sid_grado"
                value={formData.sid_grado}
                onChange={handleChange}
                options={grados}
                optionValue="id_grado"
                optionLabel="nombre"
                placeholder="Selecciona grado"
                disabled={formData.sid_nivel === "0"}
              />
            </div>

            <div className="col-lg-4">
              <CustomSelect
                label="Grupo"
                name="sid_grupo"
                value={formData.sid_grupo}
                onChange={handleChange}
                options={grupos}
                optionValue="id_grupo"
                optionLabel="nombre"
                placeholder="Selecciona grupo"
                disabled={formData.sid_grado === "0"}
              />
            </div>
          </div>
        );

      case "3": // Masivo
        return (
          <div className="mt-3">
            <small className="text-muted">
              Este mensaje será enviado a todos los usuarios.
            </small>
          </div>
        );

      case "4": // Específico
        return (
          <CustomSelect
            label="Usuario específico"
            name="sid_usuario"
            value={formData.sid_usuario || "0"}
            onChange={handleChange}
            options={alumnos} // luego API
            optionValue="id_usuario"
            optionLabel="nombre"
            placeholder="Selecciona usuario"
          />
        );

      case "5": // Extracurricular
        return (
          <CustomSelect
            label="Actividad extracurricular"
            name="sid_extracurricular"
            value={formData.sid_extracurricular}
            onChange={handleChange}
            options={extracurriculares} // luego API
            optionValue="id"
            optionLabel="nombre"
            placeholder="Selecciona actividad"
          />
        );

      default:
        return null;
    }
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
            {/* Agregar mensajes */}
            <div className="card mb-4 mb-lg-4">
              <div className="card-body p-4 p-lg-4">
                <h2 className="card-title fs-5 mb-4">Enviar Mensaje</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Columna Izquierda */}
                    <div className="col-lg-6">
                      {/* Receptor */}
                      <div className="mt-3">
                        <label>Receptor</label>
                        <select
                          name="receptor"
                          value={formData.receptor}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>
                          <option value="1">Estudiantes</option>
                          <option value="2">Nivel grado y grupo</option>
                          <option value="3">Masivo</option>
                          <option value="4">Específico</option>
                          <option value="5">Extracurricular</option>
                        </select>
                      </div>

                      {/* Tipo de Mensaje */}
                      <div className="mt-3">
                        <label>Tipo de Mensaje</label>
                        <select
                          name="sid_tipo"
                          value={formData.sid_tipo}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>

                          {mensajesTipo.map((tipo) => (
                            <option
                              key={tipo.id_tipo_mensaje}
                              value={tipo.id_tipo_mensaje}
                            >
                              {tipo.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Campos ocultos para mensaje */}
                      {renderReceptorFields()}

                      {/* Asunto */}
                      <div className="mt-3">
                        <label>Asunto</label>
                        <input
                          type="text"
                          name="asunto_mensaje"
                          value={formData.asunto_mensaje}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      {/* Mensaje */}
                      <div className="mt-3">
                        <label>Mensaje</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData.mensaje}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFormData((prev) => ({ ...prev, mensaje: data }));
                          }}
                          onReady={(editor) => {
                            editor.editing.view.change((writer) => {
                              writer.setStyle(
                                "min-height",
                                "150px",
                                editor.editing.view.document.getRoot(),
                              );
                            });
                          }}
                          config={{
                            placeholder: "Escribe aquí tu mensaje...",
                          }}
                        />
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="col-lg-6">
                      <div className="mt-3 form-check">
                        <input
                          type="checkbox"
                          name="respuesta_rapida_mensaje"
                          checked={formData.respuesta_rapida_mensaje}
                          onChange={handleChange}
                          className="form-check-input"
                          id="respuestaRapida"
                        />
                        <label
                          htmlFor="respuestaRapida"
                          className="form-check-label"
                        >
                          Permitir respuesta rápida
                        </label>
                      </div>

                      <div className="mt-3 form-check">
                        <input
                          type="checkbox"
                          name="programado_mensaje"
                          checked={formData.programado_mensaje}
                          onChange={handleChange}
                          className="form-check-input"
                          id="mensajeProgramado"
                        />
                        <label
                          htmlFor="mensajeProgramado"
                          className="form-check-label"
                        >
                          ¿Es un mensaje programado?
                        </label>
                      </div>

                      <div className="mt-3">
                        <label>Fecha de envío</label>
                        <input
                          type="date"
                          name="fecha_envio_mensaje"
                          value={formData.fecha_envio_mensaje}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.programado_mensaje}
                        />
                      </div>

                      <div className="mt-3">
                        <label>Hora de envío</label>
                        <input
                          type="time"
                          name="hora_envio_mensaje"
                          value={formData.hora_envio_mensaje}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.programado_mensaje}
                        />
                      </div>

                      <div className="row mt-3">
                        {/* Repetir */}
                        <div className="col-lg-4 d-flex align-items-center">
                          <div className="form-check mt-3">
                            <input
                              type="checkbox"
                              name="repetir_mensaje"
                              checked={formData.repetir_mensaje}
                              onChange={handleChange}
                              className="form-check-input"
                              id="repetirMensaje"
                            />
                            <label
                              htmlFor="repetirMensaje"
                              className="form-check-label"
                            >
                              Repetir
                            </label>
                          </div>
                        </div>

                        {/* Desde */}
                        <div className="col-lg-4">
                          <label>Desde</label>
                          <input
                            type="date"
                            name="periodo_mensaje"
                            value={formData.periodo_mensaje || ""}
                            onChange={handleChange}
                            className="form-control"
                            disabled={!formData.repetir_mensaje}
                          />
                        </div>

                        {/* Hasta */}
                        <div className="col-lg-4">
                          <label>Hasta</label>
                          <input
                            type="date"
                            name="fecha_fin_mensaje"
                            value={formData.fecha_fin_mensaje || ""}
                            onChange={handleChange}
                            className="form-control"
                            disabled={!formData.repetir_mensaje}
                          />
                        </div>
                      </div>

                      {/* Archivos dinámicos */}
                      <label className="mt-3 d-block">Adjuntar Archivos</label>
                      {formData.archivos.map((archivo, index) => (
                        <div
                          className="d-flex align-items-center mt-2"
                          key={index}
                        >
                          <input
                            type="file"
                            className="form-control me-2"
                            onChange={(e) =>
                              handleArchivoChange(index, e.target.files[0])
                            }
                          />
                          {formData.archivos.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger mx-1"
                              style={{ padding: "5px 7px" }}
                              onClick={() => removeFileField(index)}
                            >
                              <span
                                className="material-icons"
                                style={{ fontSize: "20px" }}
                              >
                                delete
                              </span>
                            </button>
                          )}
                          {index === formData.archivos.length - 1 &&
                            formData.archivos.length < 5 && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "5px 7px" }}
                                onClick={addFileField}
                              >
                                <span
                                  className="material-icons"
                                  style={{ fontSize: "20px" }}
                                >
                                  add
                                </span>
                              </button>
                            )}
                        </div>
                      ))}

                      {/* URLs dinámicas */}
                      <label className="mt-3 d-block">Agregar URLs</label>
                      {formData.urls.map((url, index) => (
                        <div
                          className="d-flex align-items-center mt-2"
                          key={index}
                        >
                          <input
                            type="text"
                            className="form-control me-2"
                            value={url}
                            onChange={(e) =>
                              handleUrlChange(index, e.target.value)
                            }
                            placeholder="https://..."
                          />
                          {formData.urls.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger mx-1"
                              style={{ padding: "5px 7px" }}
                              onClick={() => removeUrlField(index)}
                            >
                              <span
                                className="material-icons"
                                style={{ fontSize: "20px" }}
                              >
                                delete
                              </span>
                            </button>
                          )}
                          {index === formData.urls.length - 1 &&
                            formData.urls.length < 5 && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "5px 7px" }}
                                onClick={addUrlField}
                              >
                                <span
                                  className="material-icons"
                                  style={{ fontSize: "20px" }}
                                >
                                  add
                                </span>
                              </button>
                            )}
                        </div>
                      ))}
                    </div>

                    {/* Botón enviar */}
                    <div className="mt-4 text-end">
                      <button type="submit" className="btn btn-success">
                        Agregar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <Filter
              enabledFilters={["buscar", "rango"]}
              nombreFiltro="Mensajes"
              onFilterChange={manejarMensajesFiltros}
            />
            {/* Tabla mensajes */}
            <Table
              id="mensajesTable"
              title="Mensajes"
              columns={columns}
              data={mensajes}
              showCheckbox={true}
              renderActions={(row) => (
                <ActionButtons row={row} actions={["view", "edit"]} />
              )}
              headerButtons={(row) => (
                <TableButtons row={row} actions={["delete", "excel"]} />
              )}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
