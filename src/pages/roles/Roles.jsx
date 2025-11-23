import React from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import Form from "../../components/Form";
import { showAlert } from "../../functions/general/Alerts";
import ActionButtons from "../../components/ActionButtons";

export default function Roles() {
  const permisos = [
    {
      rol: "ADMINISTRADOR",
      icon: "manage_accounts",
      color: "#4B49AC",
      cantidad: 2,
      permisos: [
        { nombre: "ESTADÍSTICAS", activo: true },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "COBRANZA", activo: true },
        { nombre: "ESTADÍSTICAS", activo: true },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "COBRANZA", activo: true },
        { nombre: "COBRANZA", activo: true },
      ],
    },
    {
      rol: "DOCENTE",
      icon: "school",
      color: "#AF52DE",
      cantidad: 2,
      permisos: [
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: false },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: false },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
      ],
    },
    {
      rol: "ESTUDIANTE",
      icon: "person",
      color: "#00C292",
      cantidad: 2,
      permisos: [
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: true },
        { nombre: "COBRANZA", activo: false },
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: true },
        { nombre: "COBRANZA", activo: false },
        { nombre: "COBRANZA", activo: false },
      ],
    },
    {
      rol: "PADRE DE FAMILIA",
      icon: "family_restroom",
      color: "#FFC107",
      cantidad: 2,
      permisos: [
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: false },
        { nombre: "COBRANZA", activo: true },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: false },
        { nombre: "COBRANZA", activo: true },
        { nombre: "COBRANZA", activo: true },
      ],
    },
    {
      rol: "DOCENTE",
      icon: "school",
      color: "#AF52DE",
      cantidad: 2,
      permisos: [
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: false },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALENDARIO", activo: false },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
      ],
    },
    {
      rol: "ESTUDIANTE",
      icon: "person",
      color: "#00C292",
      cantidad: 2,
      permisos: [
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: true },
        { nombre: "COBRANZA", activo: false },
        { nombre: "ESTADÍSTICAS", activo: false },
        { nombre: "CALENDARIO", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: true },
        { nombre: "COBRANZA", activo: false },
        { nombre: "COBRANZA", activo: false },
      ],
    },
    {
      rol: "PADRE DE FAMILIA",
      icon: "family_restroom",
      color: "#FFC107",
      cantidad: 2,
      permisos: [
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: false },
        { nombre: "COBRANZA", activo: true },
        { nombre: "USUARIOS", activo: true },
        { nombre: "MENSAJES", activo: true },
        { nombre: "CALIFICACIONES", activo: true },
        { nombre: "ASISTENCIAS", activo: false },
        { nombre: "COBRANZA", activo: true },
        { nombre: "COBRANZA", activo: true },
      ],
    },
  ];

  const handleFormSubmit = (values) => {
    console.log("Datos enviados:", values);
    showAlert("success", "Este es un alert global");
  };

  return (
    <Layout>

      {/* Contenido */}
      <div className="container-fluid mt-4 mb-2">
        <div className="row g-4">
          {permisos.map((rol, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-3">
                    <span
                      className="material-icons me-2"
                      style={{
                        backgroundColor: `${rol.color}20`,
                        color: rol.color,
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      {rol.icon}
                    </span>
                    
                    <h6 className="fw-bold mb-0">{rol.rol}</h6>
                    <div className="form-check form-switch ms-auto">
                      <span className="mx-2" style={{fontSize:"12px"}}>Usuarios usandolo: {rol.cantidad}</span>
                    </div>
                  </div>

                  <ul className="list-unstyled mb-0">
                    {rol.permisos.map((perm, j) => (
                      <li
                        key={j}
                        className="d-flex justify-content-between align-items-center py-1 border-bottom"
                      >
                        <span className="text-secondary small">
                          {perm.nombre}
                        </span>
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={perm.activo}
                            readOnly
                            style={{ accentColor: rol.color }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    
                    <button className="btn btn-outline-danger outline-sm" style={{ padding: "5px 20px 0px" }}>
                      <span className="material-icons" style={{fontSize:"20px"}}>delete</span>
                    </button> 
                    <button className="btn btn-outline-primary btn-sm" style={{ padding: "5px 20px 0px" }}>
                      <span className="material-icons" style={{fontSize:"20px"}}>edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación 
        <div className="d-flex justify-content-between align-items-center mt-3 px-2">
          <small className="text-muted">Mostrando 1 a 4 de 40 permisos</small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <a className="page-link">&lt;</a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
            </ul>
          </nav>
        </div>*/}
      </div>
    </Layout>
  );
}
