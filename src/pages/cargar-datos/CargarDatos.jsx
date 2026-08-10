// src/pages/CargaMasiva.jsx
import React from "react";
import Layout from "../../components/Layout";
import DataUpload from "../../components/DataUpload";
import { getDataUploadRequirement } from "../../utils/dataUploadRequirements";

export default function CargarDatos() {
  const modules = [
    {
      id: "alumnos",
      label: "Padres y Alumnos",
      phpEndpoint: "http://localhost/apiAppEscolarv2/padres_alumnos_import.php",
      requirements: getDataUploadRequirement("alumnos"),
      historyModule: "padres_alumnos",
      historyModules: ["alumnos", "padres_alumnos", "Padres y Alumnos"],
    },
    {
      id: "extracurriculares",
      label: "Extracurriculares",
      phpEndpoint: "http://localhost/apiAppEscolarv2/extracurriculares_import.php",
      requirements: getDataUploadRequirement("extracurriculares"),
      historyModule: "extracurriculares",
      historyModules: ["extracurricular", "extracurriculares"],
    },
    {
      id: "seguimientos",
      label: "Seguimientos",
      phpEndpoint: "http://localhost/apiAppEscolarv2/seguimientos_import.php",
      requirements: getDataUploadRequirement("seguimientos"),
      historyModule: "seguimientos",
      historyModules: ["seguimiento", "seguimientos"],
    },
    {
      id: "calificaciones",
      label: "Calificaciones",
      phpEndpoint: "http://localhost/apiAppEscolarv2/calificaciones_import.php",
      requirements: getDataUploadRequirement("calificaciones"),
      historyModule: "calificaciones",
      historyModules: ["calificacion", "calificaciones"],
    },
  ];

  return (
    <Layout>
      <DataUpload modules={modules} simulate={true} />
      {/* simulate=true -> funciona sin backend. Pon simulate={false} para usar endpoints reales */}
    </Layout>
  );
}
