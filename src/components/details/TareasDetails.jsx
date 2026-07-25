import React, { useEffect, useState } from "react";
import Loader from "../../functions/general/Loader";
import {
  handleDeleteAsignarTarea,
  handleUpdateAsignarTarea,
  obtenerAlumnosTarea,
  obtenerArchivosTarea,
  obtenerUrlsTarea,
} from "../../functions/TeareasActions";
import TareasAlumnosTable from "../tables/TareasAlumnosTable";

export default function TareasDetails({ tarea, onClose }) {
  const [tareas, setTareas] = useState([]);
  const [urls, setUrls] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);

  const cargarAlumnos = () => {
    setLoadingAlumnos(true);
    obtenerAlumnosTarea(tarea, (data) => {
      setTareas(data);
      setLoadingAlumnos(false);
    });
  };

  useEffect(() => {
    cargarAlumnos();
    obtenerUrlsTarea(tarea.id_tareas, setUrls);
    obtenerArchivosTarea(tarea.id_tareas, setArchivos);
  }, [tarea]);
  console.log(tareas[0]?.materia);
  
  const handleEditAlumno = async (row, values) => {
    await handleUpdateAsignarTarea(row, values, cargarAlumnos);
  };

  const handleDeleteAlumno = (row) => {
    handleDeleteAsignarTarea(row, cargarAlumnos);
  };

  return (
    <div className="container-fluid mt-3 bg-white p-4 rounded" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Detalles de la tarea</h4>

        <button className="btn btn-sm text-danger fw-bold" onClick={onClose}>
          <i className="material-icons me-1" style={{ fontSize: "1rem" }}>
            close
          </i>
          Cerrar
        </button>
      </div>

      <div className="card border-0 bg-light mb-5">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="mb-2">
                <span className="text-muted me-2">Materia:</span>
                <strong>{tareas[0]?.materia || "Sin materia"}</strong>
              </div>

              <div className="mb-2">
                <span className="text-muted me-2">Nivel:</span>
                <strong>{tareas[0]?.nombre_nivel}</strong>
              </div>

              <div className="mb-2">
                <span className="text-muted me-2">Grado:</span>
                <strong>{tareas[0]?.nombre_grado}</strong>
              </div>

              <div className="mb-3">
                <span className="text-muted me-2">Grupo:</span>
                <strong>{tareas[0]?.nombre_grupo}</strong>
              </div>

              <div className="mb-4">
                <span className="text-muted d-block">Mensaje tarea:</span>
                <div
                  className="mt-1"
                  dangerouslySetInnerHTML={{
                    __html:
                      tareas[0]?.instrucciones_tarea || "Sin instrucciones",
                  }}
                />
              </div>
                  
              <div className="mb-3">
                <span className="text-muted d-block">Urls:</span>
                {tareas[0]?.urls.length > 0 ? (
                  tareas[0].urls.map((item) => (
                    <a
                      key={item.id_url_tarea}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block fw-semibold"
                    >
                      {item.url}
                    </a>
                  ))
                ) : (
                  <strong className="text-muted">No hay Url</strong>
                )}
              </div>

              <div>
                <span className="text-muted d-block">Archivos:</span>
                {tareas[0]?.archivos.length > 0 ? (
                  tareas[0]?.archivos.map((item) => (
                    <a
                      key={item.id_archivo_tarea}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block fw-semibold"
                    >
                      Ver archivo
                    </a>
                  ))
                ) : (
                  <strong className="text-muted">No hay datos</strong>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">Estudiantes a los que se envió la tarea</h4>

      {loadingAlumnos ? (
        <Loader title="Cargando alumnos..." />
      ) : (
        <TareasAlumnosTable
          data={tareas[0]?.alumnos}
          tarea={tareas[0]}
          onEdit={handleEditAlumno}
          onDelete={handleDeleteAlumno}
        />
      )}
    </div>
  );
}
