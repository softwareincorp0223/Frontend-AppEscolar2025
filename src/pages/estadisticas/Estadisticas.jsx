import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Carousel } from "bootstrap";
import imagenFondo from "../../assets/fondo.png";
import imagenFondo2 from "../../assets/fondo2.png";
import imagenFondo3 from "../../assets/fondo3.png";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/material";
import { obtenerEstadisticas } from "../../functions/EstadisticasActions";

const FALLBACK_STATS = {
  totalMensajesMes: 0,
  totalProfesores: 0,
  totalAlumnos: 0,
  totalTareasMes: 0,
  totalEventosProximos: 0,
  variacionMensajesMes: 0,
  mensajesPorDia: [],
  actividadSemanal: [],
  eventosProximos: [],
  actividadReciente: [],
};

const EVENT_BACKGROUNDS = [imagenFondo, imagenFondo2, imagenFondo3];

export default function Estadisticas() {
  const [estadisticas, setEstadisticas] = useState(FALLBACK_STATS);

  useEffect(() => {
    obtenerEstadisticas(setEstadisticas);
  }, []);

  useEffect(() => {
    const carouselElement = document.querySelector("#carouselEventos");

    if (!carouselElement) return undefined;

    const carousel = Carousel.getOrCreateInstance(carouselElement, {
      interval: 4000,
      ride: "carousel",
      pause: false,
    });

    return () => {
      carousel.dispose();
    };
  }, [estadisticas.eventosProximos.length]);

  const actividadSemanal = useMemo(() => {
    if (estadisticas.actividadSemanal.length > 0) {
      return estadisticas.actividadSemanal;
    }

    return [
      { label: "Lun", total: 0 },
      { label: "Mar", total: 0 },
      { label: "Mie", total: 0 },
      { label: "Jue", total: 0 },
      { label: "Vie", total: 0 },
      { label: "Sab", total: 0 },
      { label: "Dom", total: 0 },
    ];
  }, [estadisticas.actividadSemanal]);

  const slidesEventos = useMemo(() => {
    if (estadisticas.eventosProximos.length > 0) {
      return estadisticas.eventosProximos.map((evento, index) => ({
        ...evento,
        background: EVENT_BACKGROUNDS[index % EVENT_BACKGROUNDS.length],
        icono: "event",
        subtitulo: evento.descripcion,
      }));
    }

    return [
      {
        id_evento: "sin-eventos",
        nombre: "Sin eventos programados",
        subtitulo: "No hay actividades registradas",
        background: imagenFondo,
        icono: "event_busy",
      },
    ];
  }, [estadisticas.eventosProximos]);

  const actividadReciente = useMemo(() => {
    if (estadisticas.actividadReciente.length > 0) {
      return estadisticas.actividadReciente;
    }

    return [
      {
        icono: "info",
        color: "secondary",
        titulo: "Sin actividad reciente",
        texto: "Todavia no hay movimientos para mostrar",
        time: "Sin registros",
      },
    ];
  }, [estadisticas.actividadReciente]);

  const variacionMensajes = Number(estadisticas.variacionMensajesMes || 0);
  const tendenciaMensajes = variacionMensajes >= 0;
  const etiquetaVariacion = `${variacionMensajes >= 0 ? "+" : ""}${variacionMensajes}%`;

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-xl-4 d-flex">
            <div className="card border-0 shadow-sm rounded-4 flex-fill dashboard-card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box bg-primary-subtle text-primary">
                    <span className="material-icons">mail</span>
                  </div>

                  <div
                    className={`small fw-semibold d-flex align-items-center ${tendenciaMensajes ? "text-success" : "text-danger"
                      }`}
                  >
                    {etiquetaVariacion}
                    <span className="material-icons ms-1">
                      {tendenciaMensajes ? "trending_up" : "trending_down"}
                    </span>
                  </div>
                </div>

                <p className="text-muted small mb-0">TOTAL MENSAJES DEL MES</p>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h2 className="fw-bold mb-0">
                    {estadisticas.totalMensajesMes}
                  </h2>

                  <Box sx={{ width: { xs: 120, md: 160 } }}>
                    <BarChart
                      series={[
                        {
                          data: actividadSemanal.map((item) => item.total),
                          color: "#22c55e",
                          borderRadius: 6,
                        },
                      ]}
                      height={70}
                      xAxis={[
                        {
                          scaleType: "band",
                          data: actividadSemanal.map((item) => item.label),
                          disableLine: true,
                          disableTicks: true,
                          tickLabelStyle: { display: "none" },
                        },
                      ]}
                      yAxis={[
                        {
                          disableLine: true,
                          disableTicks: true,
                          tickLabelStyle: { display: "none" },
                        },
                      ]}
                      grid={{ horizontal: false, vertical: false }}
                      margin={{ top: 5, bottom: 5 }}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4 d-flex">
            <div className="card border-0 shadow-sm rounded-4 flex-fill dashboard-card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box bg-success-subtle text-success">
                    <span className="material-icons">groups</span>
                  </div>

                  <div className="text-muted small fw-semibold d-flex align-items-center">
                    {estadisticas.totalAlumnos} alumnos
                  </div>
                </div>

                <p className="text-muted small mb-0">TOTAL PROFESORES</p>
                <h2 className="fw-bold mt-2 mb-1">
                  {estadisticas.totalProfesores}
                </h2>

                <div className="small text-muted">
                  {estadisticas.totalTareasMes} tareas este mes -{" "}
                  {estadisticas.totalEventosProximos} eventos proximos
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 col-xl-4 d-flex">
            <div
              id="carouselEventos"
              className="carousel slide shadow-sm rounded-4 overflow-hidden flex-fill"
              data-bs-ride="carousel"
              data-bs-interval="6000"
            >
              {slidesEventos.length > 1 && (
                <div className="carousel-indicators">
                  {slidesEventos.map((evento, index) => (
                    <button
                      key={evento.id_evento}
                      type="button"
                      data-bs-target="#carouselEventos"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    ></button>
                  ))}
                </div>
              )}

              <div className="carousel-inner h-100">
                {slidesEventos.map((evento, index) => (
                  <div
                    key={evento.id_evento}
                    className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
                  >
                    <div
                      className="event-slide"
                      style={{ backgroundImage: `url(${evento.background})` }}
                    >
                      <span className="material-icons">{evento.icono}</span>
                      <h6>{evento.nombre}</h6>
                      <p>{evento.subtitulo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Actividad Reciente</h5>

                {actividadReciente.map((actividad, index) => (
                  <div key={`${actividad.titulo}-${index}`} className="activity-item">
                    <div
                      className={`activity-icon bg-${actividad.color}-subtle text-${actividad.color}`}
                    >
                      <span className="material-icons">{actividad.icono}</span>
                    </div>

                    <div className="flex-grow-1">
                      <div className="fw-semibold">{actividad.titulo}</div>
                      <div className="text-muted small">{actividad.texto}</div>
                    </div>

                    <div className="text-muted small">{actividad.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold mb-3">Mensajes rapidos</h5>

                <p className="text-muted small">
                  Envia comunicados a alumnos o padres de forma inmediata.
                </p>

                <div className="d-grid gap-2 mb-4">
                  <a
                    href="/src/pages/mensajes/index.html"
                    className="btn btn-primary rounded-3"
                  >
                    <span className="material-icons me-2">add</span>
                    Nuevo mensaje
                  </a>
                </div>

                <div className="mt-auto">
                  <p className="small text-muted mb-2">Actividad semanal</p>

                  <BarChart
                    series={[
                      {
                        data: actividadSemanal.map((item) => item.total),
                        color: "#3b82f6",
                        borderRadius: 6,
                      },
                    ]}
                    height={120}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: actividadSemanal.map((item) => item.label),
                      },
                    ]}
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
