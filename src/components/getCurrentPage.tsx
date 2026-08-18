const liga = "/src/pages/";

export const menuItems = [
  {
    label: "Estadisticas",
    icon: "bar_chart",
    link: liga + "estadisticas/index.html",
    permission: "estadisticas",
  },
  {
    label: "Configuraciones",
    icon: "settings",
    link: liga + "configuraciones/index.html",
    permission: "configuraciones",
  },
  {
    label: "Niveles y Ciclos",
    icon: "layers",
    children: [
      { label: "Niveles, grados y grupos", link: liga + "niveles/index.html", permission: "niveles" },
      { label: "Ciclos", link: liga + "ciclos/index.html", permission: "niveles" },
    ],
  },
  {
    label: "Usuarios y Padres",
    icon: "people",
    children: [
      { label: "Listar Usuarios", link: liga + "usuarios/index.html", permission: "usuarios" },
      { label: "Listar Roles", link: liga + "roles/index.html", permission: "roles" },
      { label: "Listar Padres", link: liga + "padres/index.html", permission: "padres" },
      { label: "Listar Estudiantes", link: liga + "estudiantes/index.html", permission: "estudiantes" },
    ],
  },
  {
    label: "Mensajes",
    icon: "email",
    children: [
      { label: "Mensajes", link: liga + "mensajes/index.html", permission: "mensajes" },
      { label: "Tipo de Mensaje", link: liga + "mensaje-tipo/index.html", permission: "mensajes" },
      { label: "Historial", link: liga + "mensaje-historial/index.html", permission: "mensajes" },
      { label: "Registro", link: liga + "mensaje-registro/index.html", permission: "mensajes" },
    ],
  },
  {
    label: "Extracurriculares",
    icon: "sports_esports",
    link: liga + "extracurriculares/index.html",
    permission: "extracurriculares",
  },
  {
    label: "Seguimientos",
    icon: "bookmark_added",
    children: [
      { label: "Seguimientos Academicos", link: liga + "seguimientos/index.html", permission: "seguimientos" },
      { label: "Atributos", link: liga + "seguimiento-atributos/index.html", permission: "seguimientos" },
    ],
  },
  {
    label: "Materias",
    icon: "book",
    children: [
      { label: "Materias", link: liga + "materias/index.html", permission: "materias" },
      { label: "Asignacion de Materias", link: liga + "materias-asignacion/index.html", permission: "materias" },
    ],
  },
  {
    label: "Calificaciones",
    icon: "school",
    link: liga + "calificaciones/index.html",
    permission: "calificaciones",
  },
  {
    label: "Asistencias",
    icon: "list",
    children: [
      { label: "Listar Asistencias", link: liga + "asistencias/index.html", permission: "asistencias" },
      { label: "Listar Alumnos", link: liga + "asistencia-alumnos/index.html", permission: "asistencias" },
    ],
  },
  {
    label: "Calendario",
    icon: "calendar_today",
    link: liga + "calendario/index.html",
    permission: "calendario",
  },
  {
    label: "Tareas",
    icon: "print",
    children: [
      { label: "Asignar Tareas", link: liga + "tarea-asignar/index.html", permission: "tareas" },
      { label: "Tareas", link: liga + "tareas/index.html", permission: "tareas" },
    ],
  },
  {
    label: "Cargar Datos",
    icon: "create_new_folder",
    link: liga + "cargar-datos/index.html",
    permission: "cargar_datos",

  },
  {
    label: "Pagos",
    icon: "credit_card",
    link: liga + "pagos/index.html",
    permission: "pagos",
  },
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
