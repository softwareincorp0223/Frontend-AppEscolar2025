import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import imagenPortada from "../../assets/configuracion.jpg";
import Form from "../../components/Form";
import { obtenerInstituto, obtenerUsuario, handleSave } from "../../functions/ConfiguracionActions";

export default function Configuraciones() {

  const [instituto, setInstituto] = useState(null);
  const [usuario, setUsuario] = useState([]);
  const [editingInstituto, setEditingInstituto] = useState(false);


  useEffect(() => {
    obtenerInstituto((data) => setInstituto(data[0]));
    obtenerUsuario((data) => setUsuario(data[0]));
  }, []);

  const formInstituto = [
    { name: "nombre", label: "Nombre plantel", type: "text", placeholder: "Ingresa el nombre", required: true },
    { name: "descripcion", label: "Descripción", type: "text", placeholder: "Ingresa la descripción", required: true },
  ];

  return (
    <Layout>
      <div className="container-fluid px-2 px-md-4">
        {/* 🔹 Imagen de portada */}
        <div className="position-relative mt-4 rounded-4 overflow-hidden" style={{ height: "250px", objectPosition: "right top", }}>
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
              <h4 className="mb-0 fw-bold">{instituto?.nombre || "Sin nombre"}</h4>
              <p className="text-muted mb-0">{usuario?.Rol?.nombre || "Sin rol"}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 p-5 ">
              <h5 className="text-uppercase text-secondary text-xs fw-bold mb-3">
                Información de perfil
              </h5>
              <h6><strong>Nombres:</strong> {usuario?.nombre || "Sin nombre"}</h6>
              <h6><strong>Apellidos:</strong> {usuario?.apellido || "Sin apellido"}</h6>
              <h6><strong>Correo:</strong> {usuario?.correo || "Sin correo"}</h6>
              <h6><strong>Rol:</strong> {usuario?.Rol?.nombre || "Sin rol"}</h6>
            </div>

            {/* ------- DIV normal (se oculta al editar) ------- */}
            {!editingInstituto && (
              <div className="col-md-6 p-5">
                <h5 className="text-uppercase text-secondary text-xs fw-bold mb-3">
                  Configuración de escuela
                </h5>
                <h6><strong>Nombre:</strong> {instituto?.nombre || "Sin nombre"}</h6>
                <h6><strong>Descripción:</strong> {instituto?.descripcion || "Sin descripción"}</h6>
                <h6><strong>Fecha de inicio de licencia:</strong> {instituto?.fecha_inicio_licencia || "Sin fecha"}</h6>
                <h6><strong>Datos bancarios:</strong> {instituto?.banco || "Dato no disponible"}</h6>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-success btn-sm px-4 py-2 mt-3 align-text-bottom"
                    onClick={() => setEditingInstituto(true)}
                  >
                    Editar configuración
                  </button>
                </div>

              </div>
            )}

            {/* ------- DIV de edición (solo aparece al presionar el botón) ------- */}
            {editingInstituto && (
              <div className="col-md-6 p-5">
                {/* <h5 className="text-uppercase text-secondary fw-bold mb-3">
                  Editando configuración
                </h5> */}
                <Form
                  title="Editar configuración"
                  fields={
                    formInstituto
                  }
                  columns={1}
                  onSubmit={(values) =>
                    handleSave(
                      values,
                      editingInstituto,
                      setEditingInstituto,
                      () => obtenerInstituto((data) => setInstituto(data[0]))
                    )
                  }
                  initialValues={{
                    nombre: instituto?.nombre || "",
                    descripcion: instituto?.descripcion || "",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
