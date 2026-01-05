import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logo from "../../assets/logo_fondo.png";
import { convertirLogoABase64 } from "./Functions";

export const exportarExcel = async (nombreArchivo, encabezados, datos) => {
  const logoBase64 = await convertirLogoABase64(logo);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Datos");

  if (logoBase64) {
    const imageId = workbook.addImage({
      base64: logoBase64,
      extension: "png",
    });
    sheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 160, height: 60 },
    });
    sheet.addRow([]);
    sheet.addRow([]);
  }

  // Encabezados
  const headerRow = sheet.addRow(encabezados);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  // ✅ SOLUCIÓN GENÉRICA
  datos.forEach((item) => {
    const itemNormalizado = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k.toLowerCase(), v])
    );

    const fila = encabezados.map(
      (key) => itemNormalizado[key.toLowerCase()] ?? ""
    );

    sheet.addRow(fila);
  });

  // Ajustar columnas
  sheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      max = Math.max(max, cell.value?.toString().length || 0);
    });
    col.width = max + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const hoy = new Date();
  const fecha = `${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}`;
  saveAs(new Blob([buffer]), `${nombreArchivo}_${fecha}.xlsx`);
};
