import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../assets/logo_fondo.png";
import { convertirLogoABase64 } from "./Functions";

pdfMake.vfs = pdfFonts.vfs;

export const exportarPDF = async (nombreArchivo, encabezados, datos) => {
  const logoBase64 = await convertirLogoABase64(logo);
  const hoy = new Date();
  const fecha = `${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}`;

  // Crear tarjetas
  const tarjetas = datos.map((item) => ({
    stack: encabezados.map((key) => ({
      text: `${key}: ${item[key.toLowerCase()] ?? ""}`,
      margin: [0, 2, 0, 2],
      fontSize: 11,
    })),
    margin: [0, 0, 0, 10],
    padding: 10,
    border: [true, true, true, true],
    fillColor: "#f4f4f4",
  }));

  // Dividir tarjetas en columnas (2 o 3 por fila)
  const columnas = [];
  const columnasPorFila = 2; // Cambia a 3 si quieres
  for (let i = 0; i < tarjetas.length; i += columnasPorFila) {
    columnas.push({
      columns: tarjetas.slice(i, i + columnasPorFila).map((t) => ({ stack: t.stack, margin: [5, 5] })),
    });
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 100, 40, 60],
    header: () => ({
      margin: [40, 20],
      columns: [
        logoBase64 ? { image: logoBase64, width: 80 } : {},
        { text: 'Nombre de la escuela', alignment: "right", fontSize: 14, bold: true, margin: [0, 20, 10, 0] },
      ],
    }),
    content: columnas,
  };

  pdfMake.createPdf(docDefinition).download(`${nombreArchivo}_${fecha}.pdf`);
};
