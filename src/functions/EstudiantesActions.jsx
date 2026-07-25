import { showAlert } from "./general/Alerts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import QRCode from "qrcode";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataFilter,
  InstitutoDataUpdate,
} from "./general/DataActions";
import { generarCodigoQR } from "./general/Functions";
import { phpRequest } from "./general/PhpDataActions";
import { compressImage } from "./general/ImageCompresor";

pdfMake.vfs = pdfFonts.vfs;

export const obtenerAlumnos = async (setAlumnos) => {
  try {
    const alumnosApi = await InstitutoData(
      "alumno/activos?sid_instituto=",
    );
    const formateados = alumnosApi.map((data) => ({
      ...data,
      Nivel: data.Nivel?.nombre || "Sin Nivel",
      Grado: data.Grado?.nombre || "Sin Grado",
      Grupo: data.Grupo?.nombre || "Sin Grado",
    }));
    setAlumnos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const handleSaveAlumnos = async (
  values,
  editing,
  setEditing,
  obtenerAlumnos,
) => {
  const sid_instituto = localStorage.getItem("sid_instituto");

  // Subir imagen a ImageKit
  let foto = null;

  if (values.imagen) {
    const formData = new FormData();

    const imagenComprimida = await compressImage(values.imagen);

    formData.append("files", imagenComprimida);

    const response = await InstitutoDataAdd("drive/upload", formData);

    if (response.ok && response.files.length > 0) {
      foto = response.files[0].url;
    }
  }

  // Payload alumno
  const payload = {
    id_alumno: editing ? editing.id_alumno : null,
    nombre: values.nombre,
    apellido: values.apellido,
    matricula: values.matricula,
    sexo: values.Sexo,
    codigo_qr: editing ? editing.codigo_qr : generarCodigoQR(),
    sid_nivel: values.Nivel,
    sid_grado: values.Grado,
    sid_grupo: values.Grupo,
    sid_padre: values.Padre,
    nombre_contacto: "Sin datos",
    telefono_contacto: "Sin datos",
    alergias: "Sin datos",
    sid_instituto,
  };

  if (!editing || foto) {
    payload.foto = foto;
  }

  if (editing) {
    await InstitutoDataUpdate(`alumno/${editing.id_alumno}`, payload);

    showAlert("success", "Alumno actualizado correctamente");

    setEditing(null);
  } else {
    const res = await InstitutoDataAdd("alumno", payload);

    await phpRequest("alumno.php", "modificar", {
      id_alumno: res.id_alumno,
    });

    showAlert("success", "Alumno agregado correctamente");
  }

  await obtenerAlumnos();
};

export const descargarQRsAlumnos = async () => {
  console.log("descargar");
  
  try {
    const alumnosApi = await InstitutoData(
      "alumno/activos?sid_instituto=",
    );

    if (!alumnosApi.length) {
      showAlert("error", "No hay alumnos para generar QRs");
      return;
    }

    const alumnosConQR = await Promise.all(
      alumnosApi.map(async (alumno) => ({
        ...alumno,
        qrImagen: await QRCode.toDataURL(alumno.codigo_qr),
      })),
    );

    const hoy = new Date();
    const fecha = `${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}`;

    const content = alumnosConQR.map((alumno, index) => {
      const nombreCompleto =
        `${alumno.nombre ?? ""} ${alumno.apellido ?? ""}`.trim();
      const grado = alumno.Grado?.nombre || "Sin Grado";
      const grupo = alumno.Grupo?.nombre || "Sin Grupo";

      return {
        stack: [
          {
            text: nombreCompleto || "Sin nombre",
            alignment: "center",
            bold: true,
            fontSize: 24,
            margin: [0, 40, 0, 20],
          },
          {
            text: `Grado: ${grado}`,
            alignment: "center",
            fontSize: 16,
            margin: [0, 0, 0, 8],
          },
          {
            text: `Grupo: ${grupo}`,
            alignment: "center",
            fontSize: 16,
            margin: [0, 0, 0, 35],
          },
          {
            image: alumno.qrImagen,
            width: 260,
            alignment: "center",
          },
        ],
        pageBreak: index < alumnosConQR.length - 1 ? "after" : undefined,
      };
    });

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      content,
    };

    pdfMake.createPdf(docDefinition).download(`QRs_Alumnos_${fecha}.pdf`);
  } catch (error) {
    showAlert("error", "Error al generar PDF de QRs");
  }
};

export const obtenerAlumnosPadres = async (id_padre, setAlumnos) => {
  try {
    const alumnosPadreApi = await InstitutoDataFilter(
      "alumno?include=Nivel,Grado,Grupo&sid_padre=" + id_padre,
    );
    const padreQR = await phpRequest("padre.php", "consultar", {
      id_padre: id_padre,
    });

    const formateados = alumnosPadreApi.map((data) => ({
      ...data,
      nivel: data.Nivel?.nombre || "Sin Nivel",
      grado: data.Grado?.nombre || "Sin Grado",
      grupo: data.Grupo?.nombre || "Sin Grado",
      padreQR: padreQR?.codigo_qr || "Sin QR",
    }));
    setAlumnos(formateados);
  } catch (error) {
    showAlert("error", "Error al obtener usuarios");
  }
};

export const handleDeleteVarios = async (ids, setEstudiantes) => {
  console.log(ids);

  if (ids.length == 0) {
    showAlert("error", "Selecciona los estudiantes que deseas eliminar.");
    return;
  }
  const result = await showAlert(
    "delete",
    "¿Deseas eliminar varios estudiantes?",
  );
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(ids, "alumno", "id_alumno");
  await obtenerAlumnos(setEstudiantes); // refrescar tabla
  showAlert("success", "Estudiante eliminado correctamente");
};

export const handleDelete = async (row, setEstudiantes) => {
  const result = await showAlert("delete", "¿Deseas eliminar este estudiante?");

  console.log(row);
  if (!result.isConfirmed) return;
  await InstitutoDataDelete(`alumno/${row.id_alumno}`);
  await obtenerAlumnos(setEstudiantes); // refrescar tabla
  showAlert("success", "Estudiante eliminado correctamente");
};
