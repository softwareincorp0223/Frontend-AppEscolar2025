export const menuItems = [
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