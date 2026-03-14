import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout";
import Form from "../../components/Form";
import { showAlert } from "../../functions/general/Alerts";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { obtenerEventos, handleDelete, handleSave } from "../../functions/EventosActions";
import { obtenerNiveles } from "../../functions/NivelesActions";
import { obtenerGradosPorNivel } from "../../functions/GradosActions";
import { obtenerGruposPorGrados } from "../../functions/GruposActions";

// 🔹 Configurar el localizador de fechas en español
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // lunes
  getDay,
  locales,
});

export default function Calendario() {

  // calendario
  const [evento, setEvento] = useState([]);
  const [editingEvento, setEditingEvento] = useState(null);


  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  const [todaEscuela, setTodaEscuela] = useState(false);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    obtenerNiveles(setNiveles);
    obtenerEventos(setEvento);
  }, []);

  useEffect(() => {
    if (nivelSeleccionado) {
      obtenerGradosPorNivel(nivelSeleccionado, setGrados);
      setGrupos([]);
      setGradoSeleccionado(null);
    }
  }, [nivelSeleccionado]);

  useEffect(() => {
    if (gradoSeleccionado) {
      obtenerGruposPorGrados(gradoSeleccionado, setGrupos);
    }
  }, [gradoSeleccionado]);


  useEffect(() => {
    if (!evento.length) return;

    const eventosFormateados = evento.map((ev) => {
      // Separar hora
      const [horas, minutos, segundos] = ev.hora.split(":");

      // Crear fecha base
      // console.log("fecha db", ev.fecha);
      const [year, month, day] = ev.fecha.split("-");

      const fechaBase = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
      // Crear fecha inicio
      const start = new Date(
        fechaBase.getFullYear(),
        fechaBase.getMonth(),
        fechaBase.getDate(),
        Number(horas),
        Number(minutos)
      );

      // Ejemplo: evento dura 1 hora
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      return {
        id_evento: ev.id_evento,
        title: ev.nombre,
        start,
        end,
      };
    });

    // console.log("Eventos transformados:", eventosFormateados);

    setEvents(eventosFormateados);
  }, [evento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };



  // toda la escuela


  useEffect(() => {
    // console.log("¿Toda la escuela?", todaEscuela);

    if (todaEscuela) {
      setNivelSeleccionado(null);
      setGradoSeleccionado(null);
    }
  }, [todaEscuela]);



  const formFieldsCalendario = useMemo(
    () => [

      {
        name: "nombre_evento",
        label: "Nombre del Evento",
        type: "text",
        required: true,
        placeholder: "Ej. Junta",
      },
      {
        name: "fecha_evento",
        label: "Fecha",
        type: "date",
        required: true,
      },
      {
        name: "hora_evento",
        label: "Hora",
        required: true,
        type: "time",
      },
      {
        name: "toda_escuela",
        label: "Para toda la escuela",
        type: "checkbox",
        checked: todaEscuela,
        onChange: (e) => setTodaEscuela(e.target.checked),
      },

      {
        name: "Nivel",
        label: "Nivel",
        type: "select",
        options: niveles.map((r) => ({
          value: r.id_nivel,
          label: r.nombre,
        })),
        required: false,
        disabled: todaEscuela,
        onChange: (e) => setNivelSeleccionado(e.target.value),
      },
      {
        name: "Grado",
        label: "Grado",
        type: "select",
        options: grados.map((g) => ({
          value: g.id_grado,
          label: g.nombre,
        })),
        required: false,
        disabled: todaEscuela,
        onChange: (e) => setGradoSeleccionado(e.target.value),
      },
      {
        name: "Grupo",
        label: "Grupo",
        type: "select",
        options: grupos.map((g) => ({
          value: g.id_grupo,
          label: g.nombre,
        })),
        required: false,
        disabled: todaEscuela,
      },

    ],
    [niveles, grados, grupos, todaEscuela]
  );

  const resetFormulario = () => {
    setTodaEscuela(false);
    setNivelSeleccionado(null);
    setGradoSeleccionado(null);
    setGrupos([]);
    setGrados([]);
  };

  return (
    <Layout>
      <div className="container mt-2"></div>

      {/* Contenido */}
      <div
        className="container-fluid py-4 py-lg-4"
        style={{ paddingLeft: "3px" }}
      >
        <div className="row g-4 g-lg-4 d-flex align-items-start">
          {/* Columna izquierda */}
          <div className="col-lg-8">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-3">
                <h3 className="mb-3">Calendario Escolar</h3>
                <div style={{ height: "70vh" }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectEvent={(event) =>
                      handleDelete(event, () => obtenerEventos(setEvento))
                    }
                    onSelectSlot={(slot) => {
                      const isoDate = slot.start.toISOString().slice(0, 10);
                      setForm((p) => ({ ...p, date: isoDate }));
                      alert("Fecha seleccionada: " + isoDate);
                    }}
                    culture="es" // 🌎 esto cambia todo al español
                    messages={{
                      next: "Sig.",
                      previous: "Ant.",
                      today: "Hoy",
                      month: "Mes",
                      week: "Semana",
                      day: "Día",
                      agenda: "Agenda",
                      date: "Fecha",
                      time: "Hora",
                      event: "Evento",
                      showMore: (total) => `+ Ver más (${total})`,
                    }}
                    style={{ height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Columna derecha */}
          <div className="col-lg-4">
            <Form
              title={"Agregar Evento"}
              fields={formFieldsCalendario}
              columns={1}
              onSubmit={(values) =>
                handleSave(values, editingEvento, setEditingEvento, () =>
                  obtenerEventos(setEvento),
                  resetFormulario
                )
              }
            // initialValues={editingEvento ? { nombre: editingEvento.nombre } : {}}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
