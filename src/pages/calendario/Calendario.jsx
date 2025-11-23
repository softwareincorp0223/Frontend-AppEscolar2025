import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Form from "../../components/Form";
// import { showAlert } from "../../functions/Alerts";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { obtenerCiclos, handleDelete, handleSave } from "../../functions/CiclosActions";

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
  const [ciclos, setCiclos] = useState([]);
  const [editingCiclo, setEditingCiclo] = useState(null);

  useEffect(() => {
    obtenerCiclos(setCiclos);
  }, []);

  const [events, setEvents] = useState([
    {
      title: "Inicio de clases",
      start: new Date(2025, 9, 1, 8, 0),
      end: new Date(2025, 9, 1, 10, 0),
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    allSchool: false,
    nivel: "",
    grado: "",
    grupo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Escribe un nombre y selecciona fecha");

    // crea objeto Date desde date + time (si no hay hora, usa 09:00)
    const time = form.time || "09:00";
    const start = new Date(`${form.date}T${time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora

    setEvents((prev) => [...prev, { title: form.title, start, end }]);
    setForm({ title: "", date: "", time: "", allSchool: false, nivel: "", grado: "", grupo: "" });
  };


  // fin calendario
  const formFieldsCalendario = [
    {
      name: "nombre_evento",
      label: "Nombre del Evento",
      type: "text",
      placeholder: "Ej. Junta",
    },
    {
      name: "fecha_evento",
      label: "Fecha",
      type: "date",
    },
    {
      name: "hora_evento",
      label: "Hora",
      type: "time",
    },
    {
      name: "toda_escuela",
      label: "Para toda la escuela",
      type: "checkbox",
    },
    {
      name: "sid_nivel",
      label: "Nivel",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
    },
    {
      name: "sid_grado",
      label: "Grado",
      type: "select",
      options: ["Primero", "Segundo", "Tercero"],
    },
    {
      name: "sid_grupo",
      label: "Grupo",
      type: "select",
      options: ["A", "B", "C"],
    },
  ];

  const handleFormSubmit = (values) => {
    console.log("Datos enviados:", values);
    showAlert("success", "Este es un alert global ✅");
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
                    onSelectEvent={(e) => alert(e.title)}
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
              title={editingCiclo ? "Editar Evento" : "Agregar Evento"}
              fields={formFieldsCalendario}
              columns={1}
              onSubmit={(values) => handleSave(values, editingCiclo, setEditingCiclo, () => obtenerCiclos(setCiclos))}
              initialValues={
                editingCiclo
                  ? {
                    nombre: editingCiclo.nombre,

                  }
                  : {}
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
