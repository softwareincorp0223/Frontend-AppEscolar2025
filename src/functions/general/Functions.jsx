//ya no se usa
export const filtrarDatos = (filtros, dataOriginal) => {
  let filtrado = dataOriginal;

  if (filtros.buscar) {
    const buscarLower = filtros.buscar.toLowerCase();

    filtrado = filtrado.filter((d) =>
      Object.values(d).some((valor) =>
        String(valor).toLowerCase().includes(buscarLower),
      ),
    );
  }

  if (filtros.nivel) {
    filtrado = filtrado.filter((d) => d.nivel === filtros.nivel);
  }

  if (filtros.grado) {
    filtrado = filtrado.filter((d) => d.grado === filtros.grado);
  }

  if (filtros.grupo) {
    filtrado = filtrado.filter((d) => d.grupo === filtros.grupo);
  }

  if (filtros.desde) {
    filtrado = filtrado.filter(
      (d) => new Date(d.fecha_y_hora) >= new Date(filtros.desde),
    );
  }

  if (filtros.hasta) {
    filtrado = filtrado.filter(
      (d) => new Date(d.fecha_y_hora) <= new Date(filtros.hasta),
    );
  }

  return filtrado;
};
//ya no se usa

export function fechaFormateada(fecha, { paraUI = false } = {}) {
  // si viene vacío, devolver tal cual
  if (fecha === null || fecha === undefined || fecha === "") return fecha;

  let date;
  let soloFecha = false;

  switch (true) {
    case fecha instanceof Date:
      date = fecha;
      break;

    // YYYY-MM-DD → SOLO FECHA
    case typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha):
      date = new Date(`${fecha}T00:00:00`);
      soloFecha = true;
      break;

    // ISO con hora
    case typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}T/.test(fecha):
      date = new Date(fecha);
      break;

    // timestamp
    case typeof fecha === "number":
      date = new Date(fecha);
      break;

    default:
      alert(
        `No se pudo formatear la fecha.\nValor recibido: ${fecha}\nAgrega un nuevo case.`,
      );
      return fecha;
  }

  if (isNaN(date.getTime())) return fecha;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  // FORMATO UI → DD-MM-YYYY
  if (paraUI) {
    return `${d}-${m}-${y}`;
  }

  // solo fecha (backend / export / logs)
  if (soloFecha) {
    return `${y}-${m}-${d}`;
  }

  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export const convertirLogoABase64 = async (ruta) => {
  const respuesta = await fetch(ruta);
  const blob = await respuesta.blob();
  return new Promise((resolve) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.readAsDataURL(blob);
  });
};

export function getField(obj, fields = []) {
  for (const field of fields) {
    const value = field.split(".").reduce((acc, key) => acc?.[key], obj);

    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return null;
}

export function normalizarFecha(valor) {
  if (!valor) return null;

  // Si ya es Date
  if (valor instanceof Date) return valor;

  // String
  if (typeof valor === "string") {
    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return new Date(valor + "T00:00:00");
    }

    // yyyy-mm-dd hh:mm:ss
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(valor)) {
      return new Date(valor.replace(" ", "T"));
    }

    // fallback
    const parsed = new Date(valor);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

const FIELD_MAP = {
  nombre: ["nombre", "nombre_alumno", "nombre_profesor", "asunto"],
  apellido: [
    "apellido",
    "apellido_alumno",
    "apellido_profesor",
    "matricula",
    "emisor",
  ],
  nivel: ["sid_nivel", "id_nivel", "nivel"],
  grado: ["sid_grado", "id_grado", "grado"],
  grupo: ["nombre_grupo", "grupo", "Grupo"],
  fecha: [
    "fecha_ingreso",
    "fecha",
    "fecha_creacion",
    "created_at",
    "fecha_de_envio",
  ],
};

function obtenerFechaRegistro(item) {
  for (const campo of FIELD_MAP.fecha) {
    if (item[campo]) {
      return normalizarFecha(item[campo]);
    }
  }
  return null;
}

export function filtrarTabla({ filtros, dataOriginal }) {
  let resultado = [...dataOriginal];
  console.log(filtros);

  // NIVEL
  if (filtros.nivel) {
    resultado = resultado.filter(
      (a) => getField(a, FIELD_MAP.nivel) === filtros.nivel,
    );
  }
  console.log(resultado);

  // GRADO
  if (filtros.grado) {
    resultado = resultado.filter(
      (a) => getField(a, FIELD_MAP.grado) === filtros.grado,
    );
  }

  // GRUPO
  if (filtros.grupo) {
    const g = filtros.grupo.toLowerCase();
    resultado = resultado.filter(
      (a) => getField(a, FIELD_MAP.grupo)?.toLowerCase() === g,
    );
  }

  // BÚSQUEDA (nombre + apellido)
  if (filtros.buscar && filtros.buscar.trim() !== "") {
    const b = filtros.buscar.toLowerCase();

    resultado = resultado.filter((a) => {
      const nombre = getField(a, FIELD_MAP.nombre)?.toLowerCase() || "";
      const apellido = getField(a, FIELD_MAP.apellido)?.toLowerCase() || "";
      return nombre.includes(b) || apellido.includes(b);
    });
  }

  const fechaInicio = filtros.fechaInicio || filtros.desde || null;
  const fechaFin = filtros.fechaFin || filtros.hasta || null;

  if (fechaInicio || fechaFin) {
    const desde = fechaInicio ? normalizarFecha(fechaInicio) : null;

    const hasta = fechaFin ? normalizarFecha(fechaFin + " 23:59:59") : null;

    resultado = resultado.filter((item) => {
      const fecha = obtenerFechaRegistro(item);
      if (!fecha) return false;

      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;

      return true;
    });
  }

  return resultado;
}

export function descargarQR() {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `QR_${padre.id_padre}.png`;
  link.click();
}

export const generarCodigoQR = () =>
  crypto
    .getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

export const mapReceptor = (value) => {
  switch (Number(value)) {
    case 1:
      return "Estudiantes";
    case 2:
      return "Nivel Grado y Grupo";
    case 3:
      return "Masivo";
    case 4:
      return "Especifico";
    case 5:
      return "Extracurricular";
    default:
      return "Sin destinatario";
  }
};
