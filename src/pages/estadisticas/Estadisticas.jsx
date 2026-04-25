import { useEffect } from "react";
import React from "react";
import Layout from "../../components/Layout";
import { Carousel } from "bootstrap";
import imagenFondo from "../../assets/fondo.png";
import imagenFondo2 from "../../assets/fondo2.png";
import imagenFondo3 from "../../assets/fondo3.png";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/material";



export default function Estadisticas() {

  useEffect(() => {
    const carouselElement = document.querySelector("#carouselEventos");

    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 4000,
        ride: "carousel",
        pause: false
      });
    }
  }, []);

  return (
    <Layout>
      <div className="container-fluid">

        <div className="row g-3 mb-4">

          {/* CARD 1 */}
          <div className="col-12 col-md-6 col-xl-4 d-flex">
            <div className="card border-0 shadow-sm rounded-4 flex-fill dashboard-card">
              <div className="card-body">

                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box bg-primary-subtle text-primary">
                    <span className="material-icons">mail</span>
                  </div>

                  <div className="text-success small fw-semibold d-flex align-items-center">
                    +2.5%
                    <span className="material-icons ms-1">trending_up</span>
                  </div>
                </div>

                <p className="text-muted small mb-0">TOTAL MENSAJES</p>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h2 className="fw-bold mb-0">1,245</h2>

                  <Box sx={{ width: { xs: 120, md: 160 } }}>
                    <BarChart
                      series={[{ data: [4, 6, 5, 8, 7, 9, 6], color: "#22c55e", borderRadius: 6 }]}
                      height={70}
                      xAxis={[{ scaleType: "band", data: ["L", "M", "M", "J", "V", "S", "D"], disableLine: true, disableTicks: true, tickLabelStyle: { display: "none" } }]}
                      yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: { display: "none" } }]}
                      grid={{ horizontal: false, vertical: false }}
                      margin={{ top: 5, bottom: 5 }}
                    />
                  </Box>
                </div>

              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-12 col-md-6 col-xl-4 d-flex">
            <div className="card border-0 shadow-sm rounded-4 flex-fill dashboard-card">
              <div className="card-body">

                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box bg-success-subtle text-success">
                    <span className="material-icons">groups</span>
                  </div>

                  <div className="text-danger small fw-semibold d-flex align-items-center">
                    -1.2%
                    <span className="material-icons ms-1">trending_down</span>
                  </div>
                </div>

                <p className="text-muted small mb-0">TOTAL PROFESORES</p>
                <h2 className="fw-bold mt-2 mb-0">86</h2>

              </div>
            </div>
          </div>

          {/* CARD 3 EVENTOS */}
          <div className="col-12 col-md-12 col-xl-4 d-flex">
            <div
              id="carouselEventos"
              className="carousel slide shadow-sm rounded-4 overflow-hidden flex-fill"
              data-bs-ride="carousel"
              data-bs-interval="6000"
            >

              {/* INDICADORES */}
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselEventos" data-bs-slide-to="0" className="active"></button>
                <button type="button" data-bs-target="#carouselEventos" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#carouselEventos" data-bs-slide-to="2"></button>
              </div>

              <div className="carousel-inner h-100">

                {/* SLIDE 1 */}
                <div className="carousel-item active h-100">
                  <div
                    className="event-slide"
                    style={{ backgroundImage: `url(${imagenFondo})` }}
                  >
                    <span className="material-icons">event_busy</span>
                    <h6>Sin eventos programados</h6>
                    <p>No hay actividades registradas</p>
                  </div>
                </div>

                {/* SLIDE 2 */}
                <div className="carousel-item h-100">
                  <div
                    className="event-slide"
                    style={{ backgroundImage: `url(${imagenFondo2})` }}
                  >
                    <span className="material-icons">school</span>
                    <h6>Inicio de semestre</h6>
                    <p>15 de Agosto</p>
                  </div>
                </div>

                {/* SLIDE 3 */}
                <div className="carousel-item h-100">
                  <div
                    className="event-slide"
                    style={{ backgroundImage: `url(${imagenFondo3})` }}
                  >
                    <span className="material-icons">emoji_events</span>
                    <h6>Olimpiada Matemáticas</h6>
                    <p>22 de Agosto</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ===================== FILA 2 ===================== */}
        <div className="row g-3">

          {/* ACTIVIDAD */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Actividad Reciente</h5>

                {[
                  { icon: "mail", color: "primary", title: "Nuevo mensaje enviado", text: "Aviso a padres de 3°B", time: "Hace 5 min" },
                  { icon: "assignment", color: "warning", title: "Nueva tarea publicada", text: "Proyecto Sistema Solar", time: "Hace 2 horas" },
                  { icon: "verified", color: "success", title: "Calificaciones validadas", text: "Primer bimestre cerrado", time: "Hoy 10:24" },
                  { icon: "person_add", color: "secondary", title: "Alumno registrado", text: "Ingreso al grupo 2°C", time: "Ayer" }
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className={`activity-icon bg-${a.color}-subtle text-${a.color}`}>
                      <span className="material-icons">{a.icon}</span>
                    </div>

                    <div className="flex-grow-1">
                      <div className="fw-semibold">{a.title}</div>
                      <div className="text-muted small">{a.text}</div>
                    </div>

                    <div className="text-muted small">{a.time}</div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* CARD ACCION + GRAFICA */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold mb-3">Mensajes rápidos</h5>

                <p className="text-muted small">
                  Envía comunicados a alumnos o padres de forma inmediata.
                </p>

                <div className="d-grid gap-2 mb-4">
                  <button className="btn btn-primary rounded-3">
                    <span className="material-icons me-2">add</span>
                    Nuevo mensaje
                  </button>

                  {/* <button className="btn btn-light border rounded-3">
                    Ver mensajes
                  </button> */}
                </div>

                <div className="mt-auto">
                  <p className="small text-muted mb-2">Actividad semanal</p>

                  <BarChart
                    series={[{ data: [12, 18, 15, 22, 19, 25, 20], color: "#3b82f6", borderRadius: 6 }]}
                    height={120}
                    xAxis={[{ scaleType: "band", data: ["L", "M", "M", "J", "V", "S", "D"] }]}
                  />
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}
