import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import "material-icons/iconfont/material-icons.css";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";
import { obtenerMateriasGrupo } from "../../functions/MateriasActions";
import { handleSaveTarea } from "../../functions/TeareasActions";

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
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  /*nivel grado grupo */
  useEffect(() => {
    obtenerNiveles(setNiveles);
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
  /*nivel grado grupo */

  useEffect(() => {
    if (grupoSeleccionado) {
      obtenerMateriasGrupo(
        nivelSeleccionado,
        gradoSeleccionado,
        grupoSeleccionado,
        setMaterias,
      );
    } else {
      setMaterias([]);
    }
  }, [grupoSeleccionado]);

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
    handleSaveTarea(formData);
  };

  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGrados);

      setGrupos([]);
      setGradoSeleccionado(null);
    } else {
      setGrados([]);
      setGrupos([]);
    }
  }, [nivelSeleccionado]);

  return (
    <Layout>
      <div className="container mt-2"></div>

      <div
        className="container-fluid py-4 py-lg-4"
        style={{ paddingLeft: "3px" }}
      >
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
                          className="form-control"
                          onChange={(e) => {
                            handleChange(e);

                            setNivelSeleccionado(e.target.value);

                            setGrupoSeleccionado(null);
                            setMaterias([]);

                            setFormData((prev) => ({
                              ...prev,
                              grado_tarea: "0",
                              grupo_tarea: "0",
                              materia_tarea: "0",
                            }));
                          }}
                        >
                          <option value="0">Selecciona una opción</option>

                          {niveles.map((nivel) => (
                            <option key={nivel.id_nivel} value={nivel.id_nivel}>
                              {nivel.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Grado */}
                      <div className="mt-3">
                        <label>Elegir Grado</label>
                        <select
                          name="grado_tarea"
                          value={formData.grado_tarea}
                          className="form-control"
                          disabled={
                            !formData.nivel_tarea ||
                            formData.nivel_tarea === "0"
                          }
                          onChange={(e) => {
                            handleChange(e);

                            setGradoSeleccionado(e.target.value);

                            setGrupoSeleccionado(null);
                            setMaterias([]);

                            setFormData((prev) => ({
                              ...prev,
                              grupo_tarea: "0",
                              materia_tarea: "0",
                            }));
                          }}
                        >
                          <option value="0">Selecciona una opción</option>

                          {grados.map((grado) => (
                            <option key={grado.id_grado} value={grado.id_grado}>
                              {grado.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Grupo */}
                      <div className="mt-3">
                        <label>Elegir Grupo</label>
                        <select
                          name="grupo_tarea"
                          value={formData.grupo_tarea}
                          className="form-control"
                          disabled={
                            !formData.grado_tarea ||
                            formData.grado_tarea === "0"
                          }
                          onChange={(e) => {
                            handleChange(e);
                            setGrupoSeleccionado(e.target.value);
                          }}
                        >
                          <option value="0">Selecciona una opción</option>

                          {grupos.map((grupo) => (
                            <option key={grupo.id_grupo} value={grupo.id_grupo}>
                              {grupo.nombre}
                            </option>
                          ))}
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
                          disabled={materias.length === 0}
                        >
                          <option value="0">Selecciona una opción</option>

                          {materias.map((materia) => (
                            <option
                              key={materia.id_asignar_materia}
                              value={materia.id_materia}
                            >
                              {materia.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="col-lg-6">
                      {/* Instrucciones */}
                      <div className="mt-3">
                        <label>Instrucciones de la tarea</label>
                        <ReactQuill
                          theme="snow"
                          className="editor-tarea"
                          modules={modules}
                          formats={formats}
                          value={formData.instrucciones}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              instrucciones: value,
                            }))
                          }
                          style={{
                            height: "280px",
                            marginBottom: "55px",
                          }}
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
