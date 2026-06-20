import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomSelect from "../../CustomSelect";

export default function MensajeForm({
  mensajesTipo,
  niveles,
  grados,
  grupos,
  alumnos,
  extracurriculares,
  obtenerGradosPorNivel,
  obtenerGruposPorGrados,
  onSubmit,
}) {
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
  });

  // 🔁 Cascada nivel → grado → grupo
  useEffect(() => {
    if (formData.sid_nivel !== "0") {
      obtenerGradosPorNivel(formData.sid_nivel);
      setFormData((prev) => ({ ...prev, sid_grado: "0", sid_grupo: "0" }));
    }
  }, [formData.sid_nivel]);

  useEffect(() => {
    if (formData.sid_grado !== "0") {
      obtenerGruposPorGrados(formData.sid_grado);
      setFormData((prev) => ({ ...prev, sid_grupo: "0" }));
    }
  }, [formData.sid_grado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // URLs
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

  // Archivos
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

    onSubmit(formData);
  };

  const renderReceptorFields = () => {
    switch (formData.receptor) {
      case "1": // Varios Estudiantes
        return (
          <CustomSelect
            label="Estudiantes"
            name="sid_estudiante"
            value={formData.sid_estudiante}
            onChange={handleChange}
            options={alumnos}
            optionValue="id_alumno"
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
            label="Estudiante específico"
            name="sid_estudiante"
            value={formData.sid_estudiante}
            onChange={handleChange}
            options={alumnos}
            optionValue="id_alumno"
            optionLabel="nombre"
            placeholder="Selecciona estudiante"
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
    <form onSubmit={handleSubmit}>
      <div className="row">
        <h2 className="card-title fs-5 mb-4">Enviar Mensaje</h2>

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
                <option key={tipo.id_tipo_mensaje} value={tipo.id_tipo_mensaje}>
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
            <label htmlFor="respuestaRapida" className="form-check-label">
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
            <label htmlFor="mensajeProgramado" className="form-check-label">
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
                <label htmlFor="repetirMensaje" className="form-check-label">
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
            <div className="d-flex align-items-center mt-2" key={index}>
              <input
                type="file"
                className="form-control me-2"
                onChange={(e) => handleArchivoChange(index, e.target.files[0])}
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

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
}
