import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import $ from "jquery";
import ActionButtons from "../../components/ActionButtons";
import TableButtons from "../../components/TableButtons";
import Filter from "../../components/Filter";

// import React, { useState } from "react";
// import Layout from "../../components/Layout";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Table from "../../components/Table";
// import TableButtons from "../../components/TableButtons";
// import ActionButtons from "../../components/ActionButtons";
// import Filter from "../../components/Filter";
// import "material-icons/iconfont/material-icons.css";

export default function Mensaje() {
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
    archivos: [null], // empieza con un campo
    urls: [""],
  });

  const datamensajes = useMemo(
    () => [
      {
        mensaje_id: "1",
        seleccionar: "input",
        receptor: "Primaria secundaria",
        tipo_de_envio: "AB1234",
        num_destinatarios: "Primaria",
        asunto: "Segundo",
        fecha: "Segundo",
        programado: "A",
      },
      {
        mensaje_id: "2",
        seleccionar: "input",
        receptor: "Primaria secundaria",
        tipo_de_envio: "AB1234",
        num_destinatarios: "Primaria",
        asunto: "Segundo",
        fecha: "Segundo",
        programado: "A",
      },
    ],
    []
  );

  const columns = [
    { label: "Receptor", key: "receptor" },
    { label: "Envio", key: "tipo_de_envio" },
    { label: "Num Destinatario", key: "num_destinatarios" },
    { label: "Asunto", key: "asunto" },
    { label: "Fecha", key: "fecha" },
    { label: "programado", key: "programado" },
  ];

  const [mensajes, setMensajes] = useState(datamensajes);

  useEffect(() => {
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
  }, []);

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

   const filtrarDatos = (filtros) => {
    let filtrado = datamensajes;

    if (filtros.buscar) {
      const buscarLower = filtros.buscar.toLowerCase();
      filtrado = filtrado.filter((d) =>
        d.estudiante.toLowerCase().includes(buscarLower)
      );
    }

    if (filtros.nivel) {
      filtrado = filtrado.filter((d) => d.nivel === filtros.nivel);
    }

    if (filtros.grado) {
      filtrado = filtrado.filter((d) => d.grado === filtros.grado);
    }

    if (filtros.grupo) {
      filtrado = filtrado.filter((d) => d.grupo === filtros.grupo);
    }

    if (filtros.desde) {
      filtrado = filtrado.filter(
        (d) => new Date(d.fecha_y_hora) >= new Date(filtros.desde)
      );
    }

    if (filtros.hasta) {
      filtrado = filtrado.filter(
        (d) => new Date(d.fecha_y_hora) <= new Date(filtros.hasta)
      );
    }

    setMensajes(filtrado);
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
                        </select>
                      </div>

                      {/* Nivel - Grado - Grupo */}
                      {formData.receptor === "2" && (
                        <div className="row mt-3">
                          <div className="col-lg-4">
                            <label>Nivel</label>
                            <select
                              name="sid_nivel"
                              value={formData.sid_nivel}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value="0">Selecciona una opción</option>
                            </select>
                          </div>
                          <div className="col-lg-4">
                            <label>Grado</label>
                            <select
                              name="sid_grado"
                              value={formData.sid_grado}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value="0">Selecciona una opción</option>
                            </select>
                          </div>
                          <div className="col-lg-4">
                            <label>Grupo</label>
                            <select
                              name="sid_grupo"
                              value={formData.sid_grupo}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value="0">Selecciona una opción</option>
                            </select>
                          </div>
                        </div>
                      )}

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
                                editor.editing.view.document.getRoot()
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
              //onFilterChange={filtrarDatos}
              enabledFilters={["buscar", "rango"]}
              nombreFiltro="Mensajes"
              onFilterChange={filtrarDatos}

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
