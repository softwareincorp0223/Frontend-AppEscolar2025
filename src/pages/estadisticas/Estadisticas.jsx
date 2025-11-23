import React from "react";
import Layout from "../../components/Layout";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Estadisticas() {

  const data = [
    { id: 0, value: 45, label: "Leidos" },
    { id: 1, value: 55, label: "No Leidos" },
  ];
  const padres = [
    { id: 0, value: 60, label: "Padres" },
    { id: 1, value: 40, label: "Alumnos" },
  ];
  const cantidad = [
    { id: 0, value: 25, label: "Entradas" },
    { id: 1, value: 75, label: "Salidas" },
  ];
  return (
    <Layout>
      <div className="container mt-2"></div>

      {/* Contenido */}
      <div
        className="container-fluid py-4 py-lg-4"
        style={{ paddingLeft: "3px" }}
      >
        <div className="row g-4 mb-4">
          {/* Número de Mensajes */}
          <div className="col-lg-4 col-md-6 mt-4 mb-4">
            <div
              className="card border-0 shadow-sm position-relative"
              style={{
                borderRadius: "1rem",
                overflow: "visible",
                backgroundColor: "#fff",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Tarjeta superior flotante con la gráfica */}
              <div
                className="position-absolute start-50 translate-middle-x"
                style={{
                  width: "92%",
                  borderRadius: "1rem",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 4px 10px rgba(0, 66, 128, 0.3)",
                  top: "-20px", // 🔹 sube la tarjeta un poco
                  zIndex: 150,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="p-4 d-flex flex-column align-items-center">
                  <div className="chart mb-2">
                    <PieChart
                      series={[
                        {
                          data,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          animation: {
                            duration: 1500,
                            easing: "ease-in-out", // suave al iniciar y terminar
                          },
                        },
                      ]}
                      colors={["#004280", "#bebebd"]}
                      width={280}
                      height={180}
                      slotProps={{
                        legend: { hidden: false },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta inferior blanca */}
              <div
                className="card-body text-center bg-white"
                style={{
                  borderRadius: "1rem",
                  paddingTop: "250px", // 🔹 ajusta para que haya espacio visual suficiente
                }}
              >
                <h6
                  className="mb-0 fw-bold"
                  style={{ color: "#004280", fontWeight: 900 }}
                >
                  Número de Mensajes
                </h6>
              </div>
            </div>
          </div>


          {/* Cantidad de Padres y Alumnos */}
          <div className="col-lg-4 col-md-6 mt-4 mb-4">
            <div
              className="card border-0 shadow-sm position-relative"
              style={{
                borderRadius: "1rem",
                overflow: "visible",
                backgroundColor: "#fff",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Tarjeta superior flotante con la gráfica */}
              <div
                className="position-absolute start-50 translate-middle-x"
                style={{
                  width: "92%",
                  borderRadius: "1rem",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 4px 10px rgba(67, 178, 159, 0.3)",
                  top: "-20px", // 🔹 sube la tarjeta un poco
                  zIndex: 150,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="p-4 d-flex flex-column align-items-center">
                  <div className="chart mb-2">
                    <PieChart
                      series={[
                        {
                          data: padres,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          startAngle: -90, // empieza desde arriba
                          endAngle: 270, // gira completo
                          animation: {
                            duration: 1800,
                            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // rebote dinámico
                          },
                        },
                      ]}
                      colors={["#43B29F", "#DCDCDB"]}
                      width={280}
                      height={180}
                      slotProps={{
                        legend: { hidden: false },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta inferior blanca */}
              <div
                className="card-body text-center bg-white"
                style={{
                  borderRadius: "1rem",
                  paddingTop: "250px", // 🔹 ajusta para que haya espacio visual suficiente
                }}
              >
                <h6
                  className="mb-0 fw-bold"
                  style={{ color: "#20554C", fontWeight: 900 }}
                >
                  Cantidad de Padres y Alumnos
                </h6>
              </div>
            </div>
          </div>

          {/* Cantidad de Entradas y Salidas */}
          <div className="col-lg-4 col-md-6 mt-4 mb-4">
            <div
              className="card border-0 shadow-sm position-relative"
              style={{
                borderRadius: "1rem",
                overflow: "visible",
                backgroundColor: "#fff",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Tarjeta superior flotante con la gráfica */}
              <div
                className="position-absolute start-50 translate-middle-x"
                style={{
                  width: "92%",
                  borderRadius: "1rem",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 4px 10px rgba(145, 69, 18, 0.3)",
                  top: "-20px", // 🔹 sube la tarjeta un poco
                  zIndex: 150,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="p-4 d-flex flex-column align-items-center">
                  <div className="chart mb-2">
                    <PieChart
                      series={[
                        {
                          data: cantidad,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          startAngle: -90, // empieza desde arriba
                          endAngle: 270, // gira completo
                          animation: {
                            duration: 1800,
                            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // rebote dinámico
                          },
                        },
                      ]}
                      colors={["#DB681D", "#DEDEDE"]}
                      width={280}
                      height={180}
                      slotProps={{
                        legend: { hidden: false },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta inferior blanca */}
              <div
                className="card-body text-center bg-white"
                style={{
                  borderRadius: "1rem",
                  paddingTop: "250px", // 🔹 ajusta para que haya espacio visual suficiente
                }}
              >
                <h6
                  className="mb-0 fw-bold"
                  style={{ color: "#DB681D", fontWeight: 900 }}
                >
                  Cantidad de Entradas y Salidas por Fecha
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="card shadow-sm rounded-3">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div
                  className="bg-light rounded-circle mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  {/* Aquí iría la gráfica */}
                </div>
                <h2 className="fs-6 fw-bold text-center">Otros Estadisticas</h2>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-sm rounded-3">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div
                  className="bg-light rounded-circle mb-3"
                  style={{ width: "150px", height: "150px" }}
                >
                  {/* Aquí iría la gráfica */}
                </div>
                <h2 className="fs-6 fw-bold text-center">Cantidad de Materias y Tareas</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
