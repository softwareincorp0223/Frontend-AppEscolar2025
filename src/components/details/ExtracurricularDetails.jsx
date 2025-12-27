import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import { obtenerAlumnos } from "../../functions/EstudiantesActions";
import { handleSaveExtracurricularAlumno, obtenerAlumnosExtracurricular, handleDeleteAlumnoExtracurricular } from "../../functions/ExtracurricularActions";



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


  const formFieldsExtracurricularAlumno = [
    {
      name: "sid_alumno",
      label: "Selecciona una opción",
      type: "select",
      options: alumnos.map((r) => ({
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



  return (
    <div className="card shadow-sm p-4 mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h5 className="mb-0">Editar un extracurricular</h5>
        <button className="btn btn-sm text-danger fw-bold" onClick={onClose}>
          <i className="material-icons me-1" style={{ fontSize: "1rem", position: "relative", top: "3px" }}>close</i> Cerrar
        </button>
      </div>

      <hr />
      {/* 1ERA PARTE */}
      <div className="mb-4">
        <div className="justify-content-center align-items-center">
          <div className="d-flex flex-column align-items-center gap-2 text-center">
            <h5 className="mb-0 fw-bold text-primary">
              <i className="material-icons me-1" style={{ fontSize: "20px" }}>
                sports_esports
              </i>
              {alumno.nombre}
            </h5>

            <small className="text-muted">
              N° Estudiantes:{" "}
              <span className="badge bg-primary-subtle text-primary fs-5 px-3 py-2">
                {alumnosFormateados.length}
              </span>
            </small>
          </div>

          {/* formulario */}
          <div className="gap-2">
            <Form
              title={"Agregar Alumno"}
              fields={formFieldsExtracurricularAlumno}
              columns={1}
              onSubmit={(values) =>
                handleSaveExtracurricularAlumno(
                  values,
                  alumno,
                  (id) => obtenerAlumnosExtracurricular(setAlumnosExtracurricular, id)
                )
              }
            // initialValues={editingNivel ? { nombre: editingNivel.nombre } : {}}
            />

          </div>
          <div className="gap-2">
            <Table
              title="Alumnos inscritos"
              columns={columnsAlumnos}
              data={alumnosFormateados}
              renderActions={(row) => (
                <ActionButtons
                  row={row}
                  onDelete={() =>
                    handleDeleteAlumnoExtracurricular(row, () =>
                      obtenerAlumnosExtracurricular(
                        setAlumnosExtracurricular,
                        alumno.id_extracurricular
                      )
                    )
                  }
                  actions={["delete"]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
