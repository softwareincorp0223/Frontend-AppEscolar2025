import { fechaFormateada } from "../../functions/general/Functions";
import { showAlert } from "../../functions/general/Alerts";
import { useState, useEffect } from "react";
import SeguimientosTable from "../tables/SeguimientosTable";
import { obtenerAtributoSeguimientos, handleSaveAsignarAtributo, handDeleteAsignarAtributo } from "../../functions/AsignarAtributoActions";
import { obtenerAtributos } from "../../functions/AtributosActions";


export default function SeguimientoDetails({ alumno, onClose }) {

  const [atributos, setAtributos] = useState([]);
  const [seguimiento, setSeguimiento] = useState([]);
  const [atributoSeguimiento, setAtributoSeguimiento] = useState([]);

  useEffect(() => {
    obtenerAtributoSeguimientos(setAtributoSeguimiento, alumno.id_seguimiento);
    obtenerAtributos(setAtributos);
  }, []);

  const [form, setForm] = useState({
    sid_atributo: "",
    nombre: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!form.sid_atributo) {
      showAlert("info", "Debes seleccionar un atributo");
      return;
    }

    if (!form.nombre) {
      showAlert("info", "Debes ingresar un valor");
      return;
    }

    await handleSaveAsignarAtributo(
      form,
      alumno,
      (id) => obtenerAtributoSeguimientos(setAtributoSeguimiento, id)
    );

    // limpiar formulario
    setForm({
      sid_atributo: "",
      nombre: "",
    });

  };

  const handleDelete = (row) => {
    handDeleteAsignarAtributo(row, () =>
      obtenerAtributoSeguimientos(setAtributoSeguimiento, alumno.id_seguimiento)
    );
  };

  return (
    <div
      className="container-fluid mt-3"
      style={{ maxWidth: "1400px" }}
    >
      {/* Header */}
      {/* <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1">
              
            </h4>
            <small className="text-muted">
              Administración de evaluaciones y atributos
            </small>
          </div>

          <button
            className="btn btn-outline-danger"
            onClick={onClose}
          >
            <i className="material-icons align-middle me-1">
              close
            </i>
            Cerrar
          </button>
        </div>
      </div> */}

      <div className="row g-4">

        {/* PANEL IZQUIERDO */}
        <div className="col-12 col-lg-4">

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center">

              <div
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "30px",
                }}
              >
                👨‍🎓
              </div>

              <h4 className="fw-bold mb-2">
                {alumno.nombreAlumno}
              </h4>

              <hr />

              <div className="d-grid gap-3">

                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <small className="text-muted d-block">
                      Fecha de Registro
                    </small>
                    <strong>
                      {fechaFormateada(
                        alumno.fecha_registro,
                        { paraUI: true }
                      )}
                    </strong>
                  </div>
                </div>

                <div
                  className={`card border-0 ${alumno.leido === "si"
                      ? "bg-success bg-opacity-10"
                      : "bg-danger bg-opacity-10"
                    }`}
                >
                  <div className="card-body py-2">
                    <small className="text-muted d-block">
                      Estado
                    </small>

                    <strong
                      className={
                        alumno.leido === "si"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {alumno.leido === "si"
                        ? "Leído"
                        : "No leído"}
                    </strong>
                  </div>
                </div>

                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <small className="text-muted d-block">
                      Fecha de Visualización
                    </small>
                    <strong>
                      {fechaFormateada(
                        alumno.fecha_visto,
                        { paraUI: true }
                      ) || "Sin registro"}
                    </strong>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO */}
        <div className="col-12 col-lg-8">

          {/* FORMULARIO */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">
                Agregar Seguimiento
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>

                <div className="row">

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Atributo *
                    </label>

                    <select
                      className="form-select"
                      name="sid_atributo"
                      value={form.sid_atributo}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sid_atributo: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Seleccione una opción
                      </option>

                      {atributos.map((r) => (
                        <option
                          key={r.id_atributo}
                          value={r.id_atributo}
                        >
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Valor de la Evaluación *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese el valor"
                      value={form.nombre}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success px-4"
                  >
                    Guardar
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* TABLA */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                Detalles del Seguimiento
              </h5>

              <span className="badge bg-primary">
                {atributoSeguimiento.length} registros
              </span>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <SeguimientosTable
                  data={atributoSeguimiento}
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
