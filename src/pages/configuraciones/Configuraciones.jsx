import React from "react";
import Layout from "../../components/Layout";
import imagenPortada from "../../assets/configuracion.jpg";

export default function Configuraciones() {
  return (
    <Layout>
      <div className="container-fluid px-2 px-md-4">
        {/* 🔹 Imagen de portada */}
        <div className="position-relative mt-4 rounded-4 overflow-hidden" style={{ height: "250px",objectPosition: "right top", }}>
          <img
            src={imagenPortada}
            alt="Portada"
            className="w-100 h-100 object-fit-cover"
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,66,128,0.7), rgba(31,41,55,0.7))",
            }}
          ></div>
        </div>

        {/* 🔹 Card encimada */}
        <div className="card card-body mx-3 mx-md-4 shadow rounded-4 position-relative" style={{ marginTop: "-40px", zIndex: 10 }}>
          <div className="row align-items-center mb-3">
            <div className="col-auto">
              <img
                src="https://cdn-icons-png.flaticon.com/512/167/167707.png"
                alt="profile"
                className="rounded-circle shadow"
                width="80"
                height="80"
              />
            </div>
            <div className="col">
              <h5 className="mb-0 fw-bold">UPVT</h5>
              <p className="text-muted mb-0">Administrador</p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <h6 className="text-uppercase text-secondary text-xs fw-bold mb-3">
                Información de perfil
              </h6>
              <p><strong>Nombres:</strong> Angel</p>
              <p><strong>Apellidos:</strong> Velazquez</p>
              <p><strong>Correo:</strong> test@test.com</p>
              <p><strong>Rol:</strong> Administrador</p>
            </div>

            <div className="col-md-6">
              <h6 className="text-uppercase text-secondary text-xs fw-bold mb-3">
                Configuración de escuela
              </h6>
              <p><strong>Nombre:</strong> UPVT</p>
              <p><strong>Descripción:</strong> descripción pruebas inscripción</p>
              <p><strong>Fecha de inicio de licencia:</strong> 2024-02-05</p>
              <p><strong>Datos bancarios:</strong> Bancomer</p>
              <button className="btn btn-success mt-3">Editar configuración</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
