export const menuItems = [
  {
    label: "Estadisticas",
    icon: "bar_chart",
    link: "/src/pages/estadisticas/index.html",
    permission: "estadisticas",
  },
  {
    label: "Configuraciones",
    icon: "settings",
    link: "/src/pages/configuraciones/index.html",
    permission: "configuraciones",
  },
  {
    label: "Niveles y Ciclos",
    icon: "layers",
    children: [
      { label: "Niveles, grados y grupos", link: "/src/pages/niveles/index.html", permission: "niveles" },
      { label: "Ciclos", link: "/src/pages/ciclos/index.html", permission: "niveles" },
    ],
  },
  {
    label: "Usuarios y Padres",
    icon: "people",
    children: [
      { label: "Listar Usuarios", link: "/src/pages/usuarios/index.html", permission: "usuarios" },
      { label: "Listar Roles", link: "/src/pages/roles/index.html", permission: "roles" },
      { label: "Listar Padres", link: "/src/pages/padres/index.html", permission: "padres" },
      { label: "Listar Estudiantes", link: "/src/pages/estudiantes/index.html", permission: "estudiantes" },
    ],
  },
  {
    label: "Mensajes",
    icon: "email",
    children: [
      { label: "Enviar Mensajes", link: "/src/pages/mensajes/index.html", permission: "mensajes" },
      { label: "Tipo de Mensaje", link: "/src/pages/mensaje-tipo/index.html", permission: "mensajes" },
      { label: "Historial", link: "/src/pages/mensaje-historial/index.html", permission: "mensajes" },
      { label: "Registro", link: "/src/pages/mensaje-registro/index.html", permission: "mensajes" },
    ],
  },
  {
    label: "Extracurriculares",
    icon: "sports_esports",
    link: "/src/pages/extracurriculares/index.html",
    permission: "extracurriculares",
  },
  {
    label: "Seguimientos",
    icon: "bookmark_added",
    children: [
      { label: "Seguimientos Academicos", link: "/src/pages/seguimientos/index.html", permission: "seguimientos" },
      { label: "Atributos", link: "/src/pages/seguimiento-atributos/index.html", permission: "seguimientos" },
    ],
  },
  {
    label: "Materias",
    icon: "book",
    children: [
      { label: "Materias", link: "/src/pages/materias/index.html", permission: "materias" },
      { label: "Asignacion de Materias", link: "/src/pages/materias-asignacion/index.html", permission: "materias" },
    ],
  },
  {
    label: "Calificaciones",
    icon: "school",
    link: "/src/pages/calificaciones/index.html",
    permission: "calificaciones",
  },
  {
    label: "Asistencias",
    icon: "list",
    children: [
      { label: "Listar Asistencias", link: "/src/pages/asistencias/index.html", permission: "asistencias" },
      { label: "Listar Alumnos", link: "/src/pages/asistencia-alumnos/index.html", permission: "asistencias" },
    ],
  },
  {
    label: "Calendario",
    icon: "calendar_today",
    link: "/src/pages/calendario/index.html",
    permission: "calendario",
  },
  {
    label: "Tareas",
    icon: "print",
    children: [
      { label: "Enviar Tareas", link: "/src/pages/tarea-asignar/index.html", permission: "tareas" },
      { label: "Tareas", link: "/src/pages/tareas/index.html", permission: "tareas" },
    ],
  },
  {
    label: "Cargar Datos",
    icon: "create_new_folder",
    link: "/src/pages/cargar-datos/index.html",
    permission: "cargar_datos",
  }
];

export const findPermissionByPath = (path: string): string | null => {
  for (const item of menuItems) {
    if (item.link === path) return item.permission || null;

    if (item.children) {
      const child = item.children.find((subItem) => subItem.link === path);
      if (child) return child.permission || null;
    }
  }

  return null;
};
