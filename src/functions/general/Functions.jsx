export const filtrarDatos = (filtros, dataOriginal) => {
  let filtrado = dataOriginal;

  if (filtros.buscar) {
    const buscarLower = filtros.buscar.toLowerCase();

    filtrado = filtrado.filter((d) =>
      Object.values(d).some((valor) =>
        String(valor).toLowerCase().includes(buscarLower)
      )
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
      (d) => new Date(d.fecha_y_hora) >= new Date(filtros.desde)
    );
  }

  if (filtros.hasta) {
    filtrado = filtrado.filter(
      (d) => new Date(d.fecha_y_hora) <= new Date(filtros.hasta)
    );
  }

  return filtrado;
};

export function fechaFormateada(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // meses empiezan en 0
  const d = String(date.getDate()).padStart(2, "0");
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
