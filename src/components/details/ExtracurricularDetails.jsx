import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";
import { handleSaveExtracurricularAlumno, obtenerAlumnosExtracurricular, handleDeleteAlumnoExtracurricular } from "../../functions/ExtracurricularActions";
import ExtracurricularTable from "../tables/ExtracurricularTable";
import { showAlert } from "../../functions/general/Alerts";


export default function ExtracurricularDetails({ alumno, onClose }) {

  const [alumnos, setAlumnos] = useState([]);
  const [alumnosExtracurricular, setAlumnosExtracurricular] = useState([]);


  useEffect(() => {
    obtenerAlumnos(setAlumnos);
  }, []);


  useEffect(() => {
    obtenerAlumnosExtracurricular(
      setAlumnosExtracurricular,
      alumno.id_extracurricular
    );
  }, [alumno.id_extracurricular]);

  console.log(alumnos);
  console.log(alumnosExtracurricular);

  const alumnosInscritosIds = alumnosExtracurricular.map(
    (ae) => ae.sid_alumno
  );

  const alumnosDisponibles = alumnos.filter(
    (alumno) => !alumnosInscritosIds.includes(alumno.id_alumno)
  );


  const formFieldsExtracurricularAlumno = [
    {
      name: "sid_alumno",
      label: "Selecciona una opción",
      type: "select",
      options: alumnosDisponibles.map((r) => ({
        value: r.id_alumno,
        label: `${r.nombre} ${r.apellido}`,
      })),
      required: true,
    },
  ];

  // const columnsAlumnos = [{ label: "Nombre", key: "sid_alumno" }];

  const columnsAlumnos = [
    { label: "Alumno", key: "nombre_alumno" },
  ];


  const alumnosFormateados = alumnosExtracurricular.map((r) => ({
    ...r,
    nombre_alumno: r.Alumno
      ? `${r.Alumno.nombre} ${r.Alumno.apellido}`
      : "Sin nombre",
  }));

  const handleDelete = (row) => {
    handleDeleteAlumnoExtracurricular(row, () =>
      obtenerAlumnosExtracurricular(
        setAlumnosExtracurricular,
        alumno.id_extracurricular
      )
    );
  };

  const [sidAlumno, setSidAlumno] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sidAlumno) {
      showAlert("info", "Debes seleccionar un alumno");
      return;
    }

    await handleSaveExtracurricularAlumno(
      { sid_alumno: sidAlumno },
      alumno,
      (id) => obtenerAlumnosExtracurricular(setAlumnosExtracurricular, id)
    );

    setSidAlumno("");
  };



  return (
    <div
      className="card shadow-sm border-0 p-3 p-md-4 mt-2 mx-auto"
      style={{ maxWidth: "1400px", borderRadius: "18px" }}
    >
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h5 className="mb-1 fw-bold">Detalles del extracurricular</h5>
          <small className="text-muted">
            Administra los alumnos inscritos en esta actividad.
          </small>
        </div>

        <button
          className="btn btn-light btn-sm text-danger fw-bold d-inline-flex align-items-center gap-1"
          onClick={onClose}
        >
          <i className="material-icons" style={{ fontSize: "18px" }}>
            close
          </i>
          Cerrar
        </button>
      </div>

      <div className="row g-4">
        {/* COLUMNA IZQUIERDA */}
        <div className="col-12 col-lg-4">


          {/* Formulario */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Agregar alumno</h6>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Selecciona una opción{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select"
                    value={sidAlumno}
                    onChange={(e) => setSidAlumno(e.target.value)}
                  >
                    <option value="">Seleccione...</option>

                    {alumnosDisponibles.map((r) => (
                      <option key={r.id_alumno} value={r.id_alumno}>
                        {r.nombre} {r.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="col-12 col-lg-8">
          <div className="row g-3 mb-4">
            {/* Número de estudiantes */}
            <div className="col-12 col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">
                      Número de estudiantes
                    </small>
                  </div>

                  <span className="badge bg-primary-subtle text-primary fs-5 px-3 py-2">
                    {alumnosFormateados.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Encabezado extracurricular */}
            <div className="col-12 col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="bg-primary-subtle text-primary rounded-3 p-3">
                    <i className="material-icons fs-2">
                      sports_esports
                    </i>
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Extracurricular
                    </small>

                    <h5 className="fw-bold text-primary mb-0">
                      {alumno.nombre}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                <h6 className="fw-bold mb-0">Alumnos agregados</h6>

                <span className="badge bg-secondary align-self-start align-self-sm-center">
                  {alumnosFormateados.length} registros
                </span>
              </div>

              <div className="table-responsive">
                <ExtracurricularTable
                  data={alumnosFormateados}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
