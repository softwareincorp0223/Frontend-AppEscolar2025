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
  totalPadres: 0,
  totalUsuarios: 0,
  totalAlumnos: 0,
  totalNiveles: 0,
  totalGrados: 0,
  totalGrupos: 0,
  totalTareasMes: 0,
  totalTareasSemana: 0,
  totalEventosProximos: 0,
  totalEventosHoy: 0,
  variacionMensajesMes: 0,
  mensajesPorDia: [],
  actividadSemanal: [],
  alumnosPorNivel: [],
  eventosProximos: [],
  actividadReciente: [],
};

const EVENT_BACKGROUNDS = [imagenFondo, imagenFondo2, imagenFondo3];

function StatCard({
  icon,
  color,
  label,
  value,
  detail,
  children,
  className = "",
}) {
  return (
    <div className={`card border-0 shadow-sm rounded-4 h-100 dashboard-card ${className}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`icon-box bg-${color}-subtle text-${color}`}>
            <span className="material-icons">{icon}</span>
          </div>
          {children}
        </div>

        <p className="text-muted small text-uppercase mb-1">{label}</p>
        <h2 className="fw-bold mb-1">{value}</h2>
        {detail && <div className="small text-muted">{detail}</div>}
      </div>
    </div>
  );
}

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

  const alumnosPorNivel = useMemo(() => {
    if (estadisticas.alumnosPorNivel.length > 0) {
      return estadisticas.alumnosPorNivel.slice(0, 4);
    }

    return [{ nivel: "Sin datos", total: 0 }];
  }, [estadisticas.alumnosPorNivel]);

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
  const totalComunidad =
    Number(estadisticas.totalAlumnos || 0) +
    Number(estadisticas.totalPadres || 0) +
    Number(estadisticas.totalUsuarios || 0);

  return (
    <Layout>
      <div className="container-fluid pb-4">
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="school"
              color="primary"
              label="Alumnos registrados"
              value={estadisticas.totalAlumnos}
              detail={`${estadisticas.totalPadres} padres vinculados`}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="groups"
              color="success"
              label="Comunidad escolar"
              value={totalComunidad}
              detail={`${estadisticas.totalUsuarios} usuarios del sistema`}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="person"
              color="info"
              label="Profesores activos"
              value={estadisticas.totalProfesores}
              detail="Con materias asignadas"
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="domain"
              color="warning"
              label="Estructura academica"
              value={estadisticas.totalNiveles}
              detail={`${estadisticas.totalGrados} grados / ${estadisticas.totalGrupos} grupos`}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="mail"
              color="primary"
              label="Mensajes del mes"
              value={estadisticas.totalMensajesMes}
              detail="Comunicados enviados"
            >
              <div
                className={`small fw-semibold d-flex align-items-center ${
                  tendenciaMensajes ? "text-success" : "text-danger"
                }`}
              >
                {etiquetaVariacion}
                <span className="material-icons ms-1">
                  {tendenciaMensajes ? "trending_up" : "trending_down"}
                </span>
              </div>
            </StatCard>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="assignment"
              color="warning"
              label="Tareas del mes"
              value={estadisticas.totalTareasMes}
              detail={`${estadisticas.totalTareasSemana} publicadas esta semana`}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              icon="today"
              color="danger"
              label="Eventos de hoy"
              value={estadisticas.totalEventosHoy}
              detail={`${estadisticas.totalEventosProximos} eventos proximos`}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <div
              id="carouselEventos"
              className="carousel slide shadow-sm rounded-4 overflow-hidden h-100"
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
          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Resumen operativo</h5>

                <div className="row g-3">
                  <div className="col-12 col-lg-12">
                    <p className="text-muted small mb-2">Actividad semanal</p>
                    <BarChart
                      series={[
                        {
                          data: actividadSemanal.map((item) => item.total),
                          color: "#3b82f6",
                          borderRadius: 6,
                        },
                      ]}
                      height={220}
                      xAxis={[
                        {
                          scaleType: "band",
                          data: actividadSemanal.map((item) => item.label),
                        },
                      ]}
                    />
                  </div>

                  <div className="col-12 col-lg-12">
                    <p className="text-muted small mb-2">Alumnos por nivel</p>
                    <Box sx={{ width: "100%" }}>
                      <BarChart
                        layout="horizontal"
                        series={[
                          {
                            data: alumnosPorNivel.map((item) => item.total),
                            color: "#22c55e",
                            borderRadius: 6,
                          },
                        ]}
                        height={220}
                        yAxis={[
                          {
                            scaleType: "band",
                            data: alumnosPorNivel.map((item) => item.nivel),
                          },
                        ]}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
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
        </div>
      </div>
    </Layout>
  );
}
