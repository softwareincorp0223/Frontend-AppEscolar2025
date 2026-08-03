// src/pages/CargaMasiva.jsx
import React from "react";
import Layout from "../../components/Layout";
import DataUpload from "../../components/DataUpload";

export default function CargarDatos() {
  const modules = [
    {
      id: "alumnos",
      label: "Padres y Alumnos",
      phpEndpoint: "http://localhost/apiAppEscolarv2/padres_alumnos_import.php",
      requirementsText:
        "Plantilla para padres y alumnos: captura una fila por alumno y usa la misma clave_familia para hermanos o alumnos del mismo padre/tutor. Nivel, grado y grupo deben escribirse igual que en los catálogos del sistema.",
      requirementsImages: [],
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
      phpEndpoint: "http://localhost/apiAppEscolarv2/extracurriculares_import.php",
      requirementsText:
        "Plantilla para extracurriculares: cada fila es una matrícula y cada columna es una extracurricular. Marca con X o x la actividad que se asignará; deja la celda vacía si no aplica.",
      requirementsImages: [],
    },
    {
      id: "seguimientos",
      label: "Seguimientos",
      phpEndpoint: "http://localhost/apiAppEscolarv2/seguimientos_import.php",
      requirementsText:
        "Plantilla para seguimientos: selecciona uno o varios grupos, descarga el Excel, llena observacion y/o atributos. Para dejar una celda como vacia puedes usar 0, -, N/A o dejarla en blanco.",
      requirementsImages: [],
    },
    {
      id: "calificaciones",
      label: "Calificaciones",
      phpEndpoint: "http://localhost/apiAppEscolarv2/calificaciones_import.php",
      requirementsText:
        "Plantilla para calificaciones: selecciona nivel, grado, grupo y numero de evaluaciones. El Excel usa el ciclo en curso; llena todas las calificaciones, incluso con 0 cuando corresponda.",
      requirementsImages: [],
    },
  ];

  return (
    <Layout>
      <DataUpload modules={modules} simulate={true} />
      {/* simulate=true -> funciona sin backend. Pon simulate={false} para usar endpoints reales */}
    </Layout>
  );
}
