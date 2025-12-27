import React, { useEffect, useState } from "react";
import logo from "../../src/assets/logo_app_escolar.png";
import "bootstrap/dist/css/bootstrap.min.css";

type MenuItem = {
  label: string;
  icon: string;
  link?: string;
  children?: { label: string; link: string }[];
};

export default function Aside(): JSX.Element {
  const currentPath = window.location.pathname; // ruta actual

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const menuItems = [
    {
      label: "Estadísticas",
      icon: "bar_chart",
      link: "/src/pages/estadisticas/index.html",
    },
    {
      label: "Configuraciones",
      icon: "settings",
      link: "/src/pages/configuraciones/index.html",
    },
    {
      label: "Niveles y Ciclos",
      icon: "layers",
      children: [
        { label: "Niveles, grados y grupos", link: "/src/pages/niveles/index.html" },
        { label: "Ciclos", link: "/src/pages/ciclos/index.html" },
      ],
    },
    {
      label: "Usuarios y Padres",
      icon: "people",
      children: [
        { label: "Listar Usuarios", link: "/src/pages/usuarios/index.html" },
        { label: "Listar Roles", link: "/src/pages/roles/index.html" },
        { label: "Listar Padres", link: "/src/pages/padres/index.html" },
        { label: "Listar Estudiantes", link: "/src/pages/estudiantes/index.html" },
      ],
    },
    {
      label: "Mensajes",
      icon: "email",
      children: [
        { label: "Mensajes", link: "/src/pages/mensajes/index.html" },
        { label: "Tipo de Mensaje", link: "/src/pages/mensaje-tipo/index.html" },
        { label: "Historial", link: "/src/pages/mensaje-historial/index.html" },
        { label: "Registro", link: "/src/pages/mensaje-registro/index.html" },
      ],
    },
    {
      label: "Extracurriculares",
      icon: "sports_esports",
      link: "/src/pages/extracurriculares/index.html",
    },
    {
      label: "Seguimientos",
      icon: "bookmark_added",
      children: [
        { label: "Seguimientos Academicos", link: "/src/pages/seguimientos/index.html" },
        { label: "Atributos", link: "/src/pages/seguimiento-atributos/index.html" },
        { label: "Registro", link: "/src/pages/seguimiento-registro/index.html" },
      ],
    },
    {
      label: "Materias",
      icon: "book",
      children: [
        { label: "Materias", link: "/src/pages/materias/index.html" },
        { label: "Asignación de Materias", link: "/src/pages/materias-asignacion/index.html" },
      ],
    },
    {
      label: "Calificaciones",
      icon: "school",
      link: "/src/pages/calificaciones/index.html",
    },
    {
      label: "Asistencias",
      icon: "list",
      children: [
        { label: "Listar Asistencias", link: "/src/pages/asistencias/index.html" },
        { label: "Listar Alumnos", link: "/src/pages/asistencia-alumnos/index.html" },
      ],
    },
    {
      label: "Calendario",
      icon: "calendar_today",
      link: "/src/pages/calendario/index.html",
    },
    {
      label: "Tareas",
      icon: "print",
      children: [
        { label: "Asignar Tareas", link: "/src/pages/tarea-asignar/index.html" },
        { label: "Tareas", link: "/src/pages/tareas/index.html" },
      ],
    },
    {
      label: "Cargar Datos",
      icon: "create_new_folder",
      link: "/src/pages/cargar-datos/index.html",
    },
    {
      label: "Pagos",
      icon: "credit_card",
      link: "/src/pages/pagos/index.html",
    },
  ];

  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.link === currentPath
        );

        if (hasActiveChild) {
          setOpenSubmenu(index);
        }
      }
    });
  }, [currentPath]);

  const isActive = (link?: string) => (link ? currentPath === link : false);

  return (
    <aside className="sidebar p-3 d-flex flex-column shadow fixed-top">
      <div className="px-3 py-2 mb-4">
        <h6 className="fw-bold text-center">
          <img src={logo} alt="logo" width={50} />
          <span style={{ position: "relative", top: "3px", paddingLeft: "10px" }}>
            App Escolar
          </span>
        </h6>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {menuItems.map((item, index) =>
          item.children ? (
            <React.Fragment key={index}>
              <button
                type="button"
                className="nav-link fontSize d-flex align-items-center w-100 text-start border-0 bg-transparent"
                onClick={() => setOpenSubmenu(openSubmenu === index ? null : index)}
              >
                <span className="d-flex align-items-center">
                  <span className="material-icons me-2">{item.icon}</span>
                  {item.label}
                </span>
                <span
                  className={`material-icons expand-icon ms-auto ${openSubmenu === index ? "rotate-180" : ""
                    }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className={`submenu ps-4 overflow-hidden ${openSubmenu === index ? "submenu-show" : "submenu-hide"
                  }`}
              >
                <ul className="nav flex-column">
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.link}
                        className={`nav-link fontSizeSubMenu ${isActive(subItem.link) ? "active" : ""
                          }`}
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ) : (
            <a
              key={index}
              href={item.link}
              className={`nav-link fontSize d-flex align-items-center ${isActive(item.link) ? "active" : ""
                }`}
            >
              <span className="d-flex align-items-center">
                <span className="material-icons me-2">{item.icon}</span>
                {item.label}
              </span>
            </a>
          )
        )}
      </nav>
    </aside>
  );
}
