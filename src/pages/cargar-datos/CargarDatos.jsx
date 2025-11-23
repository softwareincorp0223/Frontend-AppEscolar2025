// src/pages/CargaMasiva.jsx
import React from "react";
import Layout from "../../components/Layout";
import DataUpload from "../../components/DataUpload";

export default function CargarDatos() {
  const modules = [
    {
      id: "alumnos",
      label: "Padres y Alumnos",
      uploadUrl: "/api/upload/alumnos",
      validateUrl: "/api/validate/alumnos",
      saveUrl: "/api/save/alumnos",
      historyUrl: "/api/history/alumnos",
      templateUrl: "/plantillas/plantilla_alumnos.xlsx",
      requirementsText:
        "Plantilla para alumnos: columnas: nombre, apellido, expediente, nivel, grado, grupo.",
      requirementsImages: [
        "/plantillas/previews/plantilla_alumnos_1.png",
        "/plantillas/previews/plantilla_alumnos_2.png",
      ],
    },
    {
      id: "fotos",
      label: "Fotografías",
      uploadUrl: "/api/upload/fotos",
      validateUrl: "/api/validate/fotos",
      saveUrl: "/api/save/fotos",
      historyUrl: "/api/history/fotos",
      requirementsText:
        "Plantilla para seguimientos: columnas: nombre, apellido, expediente, nivel, grado, grupo.",
      requirementsImages: [
        "/plantillas/previews/plantilla_seguimientos_1.png",
        "/plantillas/previews/plantilla_seguimientos_2.png",
      ],
    },
    {
      id: "extracurriculares",
      label: "Extracurriculares",
      uploadUrl: "/api/upload/extracurriculares",
      validateUrl: "/api/validate/extracurriculares",
      saveUrl: "/api/save/extracurriculares",
      historyUrl: "/api/history/extracurriculares",
      templateUrl: "/plantillas/plantilla_extracurriculares.xlsx",
      requirementsText:
        "Plantilla para extracurriculares: columnas: nombre, apellido, expediente, nivel, grado, grupo.",
      requirementsImages: [
        "/plantillas/previews/plantilla_extracurriculares_1.png",
        "/plantillas/previews/plantilla_extracurriculares_2.png",
      ],
    },
    {
      id: "seguimientos",
      label: "Seguimientos",
      uploadUrl: "/api/upload/seguimientos",
      validateUrl: "/api/validate/seguimientos",
      saveUrl: "/api/save/seguimientos",
      historyUrl: "/api/history/seguimientos",
      templateUrl: "/plantillas/plantilla_seguimientos.xlsx",
      requirementsText:
        "Plantilla para seguimientos: columnas: nombre, apellido, expediente, nivel, grado, grupo.",
      requirementsImages: [
        "/plantillas/previews/plantilla_seguimientos_1.png",
        "/plantillas/previews/plantilla_seguimientos_2.png",
      ],
    },
    {
      id: "calificaciones",
      label: "Calificaciones",
      uploadUrl: "/api/upload/calificaciones",
      validateUrl: "/api/validate/calificaciones",
      saveUrl: "/api/save/calificaciones",
      historyUrl: "/api/history/calificaciones",
      templateUrl: "/plantillas/plantilla_calificaciones.xlsx",
      requirementsText:
        "Plantilla para calificaciones: columnas: nombre, apellido, expediente, nivel, grado, grupo.",
      requirementsImages: [
        "/plantillas/previews/plantilla_calificaciones_1.png",
        "/plantillas/previews/plantilla_calificaciones_2.png",
      ],
    },
  ];

  return (
    <Layout>
      <DataUpload modules={modules} simulate={true} />
      {/* simulate=true -> funciona sin backend. Pon simulate={false} para usar endpoints reales */}
    </Layout>
  );
}
