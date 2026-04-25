import { fechaFormateada } from "../../functions/general/Functions";
import { showAlert } from "../../functions/general/Alerts";
import { useState, useEffect } from "react";
import SeguimientosTable from "../tables/SeguimientosTable";
import { obtenerAtributoSeguimientos, handleSaveAsignarAtributo, handDeleteAsignarAtributo} from "../../functions/AsignarAtributoActions";
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
      obtenerAtributoSeguimientos(setAtributoSeguimiento, alumno.id_seguimiento )
    );
  };

  return (
    <div className="card shadow-sm p-4 mt-2 mx-auto" style={{ maxWidth: "1100px" }}>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h6 className="mb-0">Datos del seguimiento</h6>
            <button className="btn btn-sm text-danger fw-bold" onClick={onClose}>
              <i className="material-icons me-1" style={{ fontSize: "1rem", position: "relative", top: "3px" }}>close</i> Cerrar
            </button>
          </div>
          <div className="text-center">

            <h3 className="fw-bold text-primary mb-2">
              {alumno.nombreAlumno}
            </h3>
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
              <span className="badge badge-primary-custom ap-2 px-3">
                📩 Enviado: {fechaFormateada(alumno.fecha_registro, { paraUI: true })}
              </span>
              <span
                className={`badge p-2 px-3 ${alumno.leido === "si" ? "bg-success" : "bg-danger text-white"
                  }`}
              >
                👁️ {alumno.leido === "si" ? "Leído" : "No leído"}
              </span>
              <span className="badge badge-primary-custom text-dark p-2 px-3">
                📅 Visto: {fechaFormateada(alumno.fecha_visto, { paraUI: true }) || "Sin registro"}
              </span>
            </div>
          </div>
          <hr />
          <div className="gap-2">
            <h2 className="card-title fs-5 mb-4">Agregar Seguimiento</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Atributo */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Atributo <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="sid_atributo"
                    value={form.sid_atributo}
                    onChange={(e) =>
                      setForm({ ...form, sid_atributo: e.target.value })
                    }
                  >
                    <option value="">Seleccione una opción</option>
                    {atributos.map((r) => (
                      <option key={r.id_atributo} value={r.id_atributo}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valor */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Valor de la Evaluación <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Ingrese el valor"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </div>

              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-success">
                  Guardar
                </button>
              </div>
            </form>
          </div>
          <div className="gap-2">
            <h6 className="fw-bold mb-2">Detalles del Seguimiento</h6>
            <SeguimientosTable
              data={atributoSeguimiento}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
