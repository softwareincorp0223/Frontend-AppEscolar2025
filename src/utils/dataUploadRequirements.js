export const dataUploadRequirements = [
  {
    id: "alumnos",
    titulo: "Padres y Alumnos",
    icono: "create_new_folder",
    descripcion: {
      paso1:
        "Descarga la plantilla desde el boton Descargar Plantilla. Esa plantilla ya trae las columnas esperadas para padres y alumnos.",
      paso2:
        "Llena una fila por alumno. Si varios alumnos pertenecen al mismo padre o tutor, usa la misma clave_familia para relacionarlos.",
      paso3:
        "Verifica que nivel, grado y grupo esten escritos igual que en los catalogos del sistema. No cambies nombres de columnas.",
      paso4:
        "Sube el archivo Excel y presiona Subir. El sistema valida los datos antes de permitir guardarlos.",
      paso5:
        "Si aparecen errores, revisa la fila, columna, valor y correccion indicada. Corrige el Excel y vuelve a subirlo.",
      paso6:
        "Cuando el estado sea VALIDADO, presiona Guardar para registrar padres, alumnos y asignaciones en la base de datos.",
    },
    imagenes: {
      paso1: "/plantillas/guia/padres_alumnos_paso1.png",
      paso2: "/plantillas/guia/padres_alumnos_paso2.png",
      paso3: "/plantillas/guia/padres_alumnos_paso3.png",
      paso4: "/plantillas/guia/padres_alumnos_paso4.png",
      paso5: "/plantillas/guia/padres_alumnos_paso5.png",
      paso6: "/plantillas/guia/padres_alumnos_paso6.png",
    },
  },
  {
    id: "fotos",
    titulo: "Fotografias",
    icono: "image",
    descripcion: {
      paso1:
        "Prepara las fotografias de los alumnos con nombres faciles de identificar, de preferencia usando matricula o nombre completo.",
      paso2:
        "Selecciona el archivo permitido para el modulo de fotografias.",
      paso3:
        "Sube el archivo y espera la validacion. El sistema revisa que el contenido pueda asociarse correctamente.",
      paso4:
        "Si hay errores, corrige los nombres o el formato indicado y vuelve a subir el archivo.",
      paso5:
        "Cuando la carga este validada, guarda los cambios para actualizar las fotografias.",
    },
    imagenes: {
      paso1: "/plantillas/guia/fotografias_paso1.png",
      paso2: "/plantillas/guia/fotografias_paso2.png",
      paso3: "/plantillas/guia/fotografias_paso3.png",
      paso4: "/plantillas/guia/fotografias_paso4.png",
      paso5: "/plantillas/guia/fotografias_paso5.png",
    },
  },
  {
    id: "extracurriculares",
    titulo: "Extracurriculares",
    icono: "sports_soccer",
    descripcion: {
      paso1:
        "Selecciona las extracurriculares que quieres incluir y descarga la plantilla.",
      paso2:
        "Cada fila corresponde a una matricula. Cada columna corresponde a una extracurricular seleccionada.",
      paso3:
        "Marca con X o x las actividades que se asignaran al alumno. Deja la celda vacia cuando no aplique.",
      paso4:
        "Sube el archivo y espera la validacion de matriculas y actividades.",
      paso5:
        "Si salen errores, corrige las filas indicadas y vuelve a subir el archivo.",
      paso6:
        "Cuando el archivo este VALIDADO, presiona Guardar para crear las asignaciones.",
    },
    imagenes: {
      paso1: "/plantillas/guia/extracurriculares_paso1.png",
      paso2: "/plantillas/guia/extracurriculares_paso2.png",
      paso3: "/plantillas/guia/extracurriculares_paso3.png",
      paso4: "/plantillas/guia/extracurriculares_paso4.png",
      paso5: "/plantillas/guia/extracurriculares_paso5.png",
      paso6: "/plantillas/guia/extracurriculares_paso6.png",
    },
  },
  {
    id: "seguimientos",
    titulo: "Seguimientos",
    icono: "assignment",
    descripcion: {
      paso1:
        "Selecciona uno o varios grupos y descarga la plantilla de seguimientos.",
      paso2:
        "La plantilla incluye alumnos y atributos disponibles para los grupos seleccionados.",
      paso3:
        "Llena observacion y los atributos que correspondan. Para dejar una celda vacia puedes usar 0, -, N/A o dejarla en blanco.",
      paso4:
        "Sube el Excel y espera la validacion.",
      paso5:
        "Si aparecen errores, corrige las celdas indicadas y vuelve a cargar el archivo.",
      paso6:
        "Guarda solo cuando el archivo este VALIDADO para registrar los seguimientos.",
    },
    imagenes: {
      paso1: "/plantillas/guia/seguimientos_paso1.png",
      paso2: "/plantillas/guia/seguimientos_paso2.png",
      paso3: "/plantillas/guia/seguimientos_paso3.png",
      paso4: "/plantillas/guia/seguimientos_paso4.png",
      paso5: "/plantillas/guia/seguimientos_paso5.png",
      paso6: "/plantillas/guia/seguimientos_paso6.png",
    },
  },
  {
    id: "calificaciones",
    titulo: "Calificaciones",
    icono: "grade",
    descripcion: {
      paso1:
        "Selecciona nivel, grado, grupo y numero de evaluaciones antes de descargar la plantilla.",
      paso2:
        "La plantilla se genera con el ciclo en curso y los alumnos del grupo seleccionado.",
      paso3:
        "Captura todas las calificaciones. Usa 0 cuando esa sea la calificacion real.",
      paso4:
        "Sube el archivo y deja que el sistema valide alumnos, materias y evaluaciones.",
      paso5:
        "Si hay errores, revisa las filas indicadas, corrige el Excel y subelo de nuevo.",
      paso6:
        "Cuando el estado sea VALIDADO, presiona Guardar para registrar las calificaciones.",
    },
    imagenes: {
      paso1: "/plantillas/guia/calificaciones_paso1.png",
      paso2: "/plantillas/guia/calificaciones_paso2.png",
      paso3: "/plantillas/guia/calificaciones_paso3.png",
      paso4: "/plantillas/guia/calificaciones_paso4.png",
      paso5: "/plantillas/guia/calificaciones_paso5.png",
      paso6: "/plantillas/guia/calificaciones_paso6.png",
    },
  },
];

export const getDataUploadRequirement = (id) =>
  dataUploadRequirements.find((item) => item.id === id);
