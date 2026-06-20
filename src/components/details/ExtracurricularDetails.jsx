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
      className="card shadow-sm p-4 mt-2 mx-auto"
      style={{ maxWidth: "1400px" }}
    >
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Detalles del extracurricular</h5>

        <button
          className="btn btn-sm text-danger fw-bold"
          onClick={onClose}
        >
          <i
            className="material-icons me-1"
            style={{
              fontSize: "1rem",
              position: "relative",
              top: "3px",
            }}
          >
            close
          </i>
          Cerrar
        </button>
      </div>

      <div className="row g-4">

        {/* COLUMNA IZQUIERDA */}
        <div className="col-12 col-lg-4">

          {/* Datos generales */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">

              <h5 className="fw-bold text-primary mb-3">
                <i
                  className="material-icons me-1"
                  style={{ fontSize: "20px" }}
                >
                  sports_esports
                </i>
                {alumno.nombre}
              </h5>

              <div className="mb-2">
                <span className="text-muted">
                  Número de estudiantes
                </span>
              </div>

              <span className="badge bg-primary-subtle text-primary fs-5 px-3 py-2">
                {alumnosFormateados.length}
              </span>
            </div>
          </div>

          {/* Formulario */}
          <div className="card shadow-sm border-0">
            <div className="card-body">

              <h6 className="fw-bold mb-3">
                Agregar Alumno
              </h6>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Selecciona una opción{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select"
                    value={sidAlumno}
                    onChange={(e) =>
                      setSidAlumno(e.target.value)
                    }
                  >
                    <option value="">
                      Seleccione...
                    </option>

                    {alumnosDisponibles.map((r) => (
                      <option
                        key={r.id_alumno}
                        value={r.id_alumno}
                      >
                        {r.nombre} {r.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Guardar
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="col-12 col-lg-8">

          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Alumnos Agregados
                </h6>

                <span className="badge bg-secondary">
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
