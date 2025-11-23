import React, { useState } from "react";
import Layout from "../../components/Layout";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "material-icons/iconfont/material-icons.css";

export default function TareaAsignar() {
  const [formData, setFormData] = useState({
    nivel_tarea: "0",
    grado_tarea: "0",
    grupo_tarea: "0",
    materia_tarea: "0",
    instrucciones: "",
    archivos: [null], // empieza con un campo
    urls: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    console.log("Formulario enviado:", formData);
  };

  return (
    <Layout>
      <div className="container mt-2"></div>

      <div className="container-fluid py-4 py-lg-4" style={{ paddingLeft: "3px" }}>
        <div className="row g-4 g-lg-4">
          <div className="col-lg-12">
            <div className="card mb-4 mb-lg-4">
              <div className="card-body p-4 p-lg-4">
                <h2 className="card-title fs-5 mb-4">Agregar Tarea</h2>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Columna Izquierda */}
                    <div className="col-lg-6">
                      {/* Nivel */}
                      <div className="mt-3">
                        <label>Elegir Nivel</label>
                        <select
                          name="nivel_tarea"
                          value={formData.nivel_tarea}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>
                        </select>
                      </div>

                      {/* Grado */}
                      <div className="mt-3">
                        <label>Elegir Grado</label>
                        <select
                          name="grado_tarea"
                          value={formData.grado_tarea}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>
                        </select>
                      </div>

                      {/* Grupo */}
                      <div className="mt-3">
                        <label>Elegir Grupo</label>
                        <select
                          name="grupo_tarea"
                          value={formData.grupo_tarea}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>
                        </select>
                      </div>

                      {/* Materia */}
                      <div className="mt-3">
                        <label>Elegir Materia</label>
                        <select
                          name="materia_tarea"
                          value={formData.materia_tarea}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="0">Selecciona una opción</option>
                        </select>
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="col-lg-6">
                      {/* Instrucciones */}
                      <div className="mt-3">
                        <label>Instrucciones de la tarea</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData.instrucciones}
                          config={{
                            placeholder: "Escribe aquí las instrucciones...",
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFormData({ ...formData, instrucciones: data });
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
                        />
                      </div>

                      {/* Archivos dinámicos */}
                      <label className="mt-3 d-block">Adjuntar Archivos</label>
                      {formData.archivos.map((archivo, index) => (
                        <div className="d-flex align-items-center mt-2" key={index}>
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
                              <span className="material-icons" style={{ fontSize: "20px" }}>
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
                                <span className="material-icons" style={{ fontSize: "20px" }}>
                                  add
                                </span>
                              </button>
                            )}
                        </div>
                      ))}

                      {/* URLs dinámicas */}
                      <label className="mt-3 d-block">Agregar URLs</label>
                      {formData.urls.map((url, index) => (
                        <div className="d-flex align-items-center mt-2" key={index}>
                          <input
                            type="text"
                            className="form-control me-2"
                            value={url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            placeholder="https://..."
                          />
                          {formData.urls.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger mx-1"
                              style={{ padding: "5px 7px" }}
                              onClick={() => removeUrlField(index)}
                            >
                              <span className="material-icons" style={{ fontSize: "20px" }}>
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
                                <span className="material-icons" style={{ fontSize: "20px" }}>
                                  add
                                </span>
                              </button>
                            )}
                        </div>
                      ))}

                      {/* Botón Enviar */}
                      <div className="mt-4 text-end">
                        <button type="submit" className="btn btn-success">
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
