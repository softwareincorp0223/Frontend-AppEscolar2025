import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../assets/logo_fondo.png";
import { convertirLogoABase64 } from "./Functions";

pdfMake.vfs = pdfFonts.vfs;

export const ExportarPDFCalificacion = async (
  nombreArchivo,
  alumno,
  evaluaciones
) => {
  const logoBase64 = await convertirLogoABase64(logo);

  const hoy = new Date();
  const fecha = `${hoy.getDate()}/${hoy.getMonth() + 1
    }/${hoy.getFullYear()}`;

  const bodyTabla = [
    [
      {
        text: "MATERIA",
        style: "tableHeader",
      },
      {
        text: "PERIODO",
        style: "tableHeader",
      },
      {
        text: "CALIFICACIÓN",
        style: "tableHeader",
      },
      {
        text: "CICLO",
        style: "tableHeader",
      },
    ],
  ];

  // RECORRER EVALUACIONES
  evaluaciones.forEach((ev) => {

    ev.Calificaciones.forEach((cal) => {

      bodyTabla.push([
        {
          text: cal.Materia?.nombre || "",
          alignment: "left",
        },

        {
          text: `Periodo ${cal.periodo}`,
          alignment: "center",
        },

        {
          text: cal.calificacion,
          alignment: "center",
          bold: true,
        },

        {
          text: ev.ciclo,
          alignment: "center",
        },
      ]);

    });

  });

  const docDefinition = {
    pageSize: "LETTER",

    pageMargins: [40, 120, 40, 80],

    background: [
      {
        image: logoBase64,
        width: 300,
        opacity: 0.05,
        absolutePosition: { x: 150, y: 250 },
      },
    ],

    header: {
      margin: [40, 20, 40, 0],
      columns: [
        {
          image: logoBase64,
          width: 70,
        },

        {
          width: "*",
          stack: [
            {
              text: "SECRETARÍA DE EDUCACIÓN",
              style: "titulo",
            },
            {
              text: `${alumno.Instituto.nombre}`,
              style: "subtitulo",
            },
            {
              text: "BOLETA DE CALIFICACIONES",
              style: "boleta",
            },
          ],
          alignment: "center",
          margin: [0, 10, 0, 0],
        },
      ],
    },

    footer: (currentPage, pageCount) => ({
      margin: [40, 10],
      columns: [
        {
          text: `Fecha de emisión: ${fecha}`,
          fontSize: 9,
        },
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 9,
        },
      ],
    }),

    content: [
      // DATOS DEL ALUMNO
      {
        text: "DATOS DEL ALUMNO",
        style: "sectionTitle",
      },

      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              {
                text: "Alumno",
                style: "infoLabel",
              },
              {
                text: `${alumno.nombre} ${alumno.apellido}`,
                style: "infoValue",
              },
              {
                text: "Matrícula",
                style: "infoLabel",
              },
              {
                text: alumno.matricula,
                style: "infoValue",
              },
            ],

            [
              {
                text: "Nivel",
                style: "infoLabel",
              },
              {
                text: alumno.Nivel?.nombre || "",
                style: "infoValue",
              },

              {
                text: "Grado / Grupo",
                style: "infoLabel",
              },
              {
                text: `${alumno.Grado?.nombre || ""} - ${alumno.Grupo?.nombre || ""
                  }`,
                style: "infoValue",
              },
            ],
          ],
        },

        layout: {
          fillColor: (rowIndex) => {
            return rowIndex % 2 === 0 ? "#f5f5f5" : null;
          },
        },

        margin: [0, 10, 0, 25],
      },

      // TABLA
      {
        text: "CALIFICACIONES",
        style: "sectionTitle",
      },

      {
        table: {
          headerRows: 1,
          widths: ["40%", "20%", "20%", "20%"],
          body: bodyTabla,
        },

        layout: {
          fillColor: (rowIndex) => {
            return rowIndex === 0 ? "#004280" : null;
          },

          hLineColor: () => "#cccccc",
          vLineColor: () => "#cccccc",
        },

        margin: [0, 10, 0, 30],
      },

      // PROMEDIO FINAL DESTACADO
      {
        table: {
          widths: ["70%", "30%"],
          body: [
            [
              {
                text: "PROMEDIO FINAL GENERAL",
                style: "promedioTitulo",
              },
              {
                text:
                  evaluaciones[evaluaciones.length - 1]
                    ?.promedio_final || "",
                style: "promedioValor",
              },
            ],
          ],
        },

        layout: {
          fillColor: () => "#e8f0ff",
        },

        margin: [0, 10, 0, 50],
      },

      // FIRMAS
      {
        margin: [0, 60, 0, 0],

        columns: [

          {
            width: "50%",
            alignment: "center",

            stack: [

              {
                canvas: [
                  {
                    type: "line",
                    x1: 40,
                    y1: 0,
                    x2: 180,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
              },

              {
                text: "Firma del Director",
                alignment: "center",
                margin: [0, 8, 0, 0],
                bold: true,
              },

            ],
          },

          {
            width: "50%",
            alignment: "center",

            stack: [

              {
                canvas: [
                  {
                    type: "line",
                    x1: 40,
                    y1: 0,
                    x2: 180,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
              },

              {
                text: "Firma del Tutor",
                alignment: "center",
                margin: [0, 8, 0, 0],
                bold: true,
              },

            ],
          },

        ],
      },
    ],

    styles: {
      titulo: {
        fontSize: 16,
        bold: true,
        color: "#004280",
      },

      subtitulo: {
        fontSize: 12,
        margin: [0, 2, 0, 0],
      },

      boleta: {
        fontSize: 15,
        bold: true,
        color: "#007a4d",
        margin: [0, 5, 0, 0],
      },

      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: "#004280",
        margin: [0, 10, 0, 5],
      },

      tableHeader: {
        color: "white",
        bold: true,
        alignment: "center",
        margin: [0, 5, 0, 5],
      },

      infoLabel: {
        bold: true,
        fontSize: 10,
      },

      infoValue: {
        fontSize: 10,
      },

      promedioTitulo: {
        bold: true,
        fontSize: 13,
        color: "#004280",
      },

      promedioValor: {
        bold: true,
        fontSize: 18,
        alignment: "center",
        color: "#007a4d",
      },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`${nombreArchivo}_${fecha}.pdf`);
};