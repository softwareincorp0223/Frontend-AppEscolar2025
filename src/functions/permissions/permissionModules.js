export const normalizePermissionName = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const permissionNameToModuleKeys = {
  estadisticas: ["estadisticas"],
  "usuarios y padres": ["usuarios", "roles", "padres", "estudiantes"],
  mensajes: ["mensajes"],
  calendario: ["calendario"],
  extracurriculares: ["extracurriculares"],
  seguimientos: ["seguimientos"],
  calificaciones: ["calificaciones"],
  materias: ["materias"],
  asistencias: ["asistencias"],
  cobranza: ["pagos"],
  tareas: ["tareas"],
  configuraciones: ["configuraciones", "niveles", "cargar_datos"],
};

export const getModuleKeysFromPermissionName = (permissionName) =>
  permissionNameToModuleKeys[normalizePermissionName(permissionName)] || [];
