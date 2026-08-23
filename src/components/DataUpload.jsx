import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "select2/dist/css/select2.css";
import Modal from "./Modal";
import { showAlert } from "../functions/general/Alerts";

window.$ = window.$ || $;
window.jQuery = window.jQuery || $;

const TEST_MODE_STORAGE_KEY = "dataUploadTestMode";
const HISTORY_LIMIT = 10;
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api/"
    : "/sistema/api/";


/**
 * DataUpload
 * - props:
 *   - modules: array de objetos { id, label, uploadUrl?, validateUrl?, saveUrl?, historyUrl?, templateUrl?, requirementsText?, requirementsImages?: [] }
 *   - initialModuleId?: id por defecto
 *   - simulate?: true -> funciona sin backend (por defecto true)
 *
 * Cambios realizados:
 * - Añadí un switch para activar/desactivar el modo test desde la interfaz (no cambio el prop `simulate`, lo tomo como valor inicial).
 * - Reemplacé los <i> con Material Icons donde había íconos.
 * - Mejoré el modal de "Requerimientos": ahora muestra texto e imágenes (si el módulo provee `requirementsImages`).
 * - Aseguro que el cambio de módulos refresque correctamente el historial y la selección.
 * - Añadí pequeños botones útiles (ver/descargar si hay URL) y validaciones mínimas.
 * - Comentarios en primera persona, resumidos y en español.
 */

export default function DataUpload({
  modules = [],
  initialModuleId = null,
  simulate = true,
}) {
  // Inicializo el módulo seleccionado con el id inicial o el primero del array
  const [selectedModuleId, setSelectedModuleId] = useState(
    () => initialModuleId || (modules[0] && modules[0].id) || null
  );

  // Modo "test" controlado desde la UI (valor inicial viene del prop simulate)
  const [isTestMode, setIsTestMode] = useState(() => {
    const saved = localStorage.getItem(TEST_MODE_STORAGE_KEY);
    if (saved === "true") return true;
    if (saved === "false") return false;
    return Boolean(simulate);
  });

  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1); // 1 = subir, 2 = validar, 3 = guardar
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState(null);
  const [templateSelectionOpen, setTemplateSelectionOpen] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplateOptions, setSelectedTemplateOptions] = useState([]);
  const [pendingTemplateOption, setPendingTemplateOption] = useState("");
  const [templateNivel, setTemplateNivel] = useState("");
  const [templateGrado, setTemplateGrado] = useState("");
  const [templateGrupo, setTemplateGrupo] = useState("");
  const [templateNumeroEvaluaciones, setTemplateNumeroEvaluaciones] = useState("1");
  const [templateOptionsLoading, setTemplateOptionsLoading] = useState(false);
  const fileInputRef = useRef();
  const templateSelectRef = useRef(null);

  // Obtengo el módulo activo a partir del id seleccionado
  const active = modules.find((m) => m.id === selectedModuleId) || {};
  const activeRequirements = active.requirements || {};
  const requirementSteps = activeRequirements.descripcion
    ? Object.entries(activeRequirements.descripcion)
    : [];
  const requirementImages = activeRequirements.imagenes
    ? Object.entries(activeRequirements.imagenes)
    : [];
  const isPhpImport = Boolean(active.phpEndpoint);
  const usesTemplateSelection =
    (active.id === "extracurriculares" ||
      active.id === "seguimientos" ||
      active.id === "calificaciones") &&
    isPhpImport;
  const isSeguimientosImport = active.id === "seguimientos" && isPhpImport;
  const isCalificacionesImport = active.id === "calificaciones" && isPhpImport;
  const usesSchoolGroupSelection = isSeguimientosImport || isCalificacionesImport;
  const hasCalificacionesGroupSelected =
    isCalificacionesImport && selectedTemplateOptions.length > 0;
  const sidInstituto = () => localStorage.getItem("sid_instituto") || "";
  const idUsuario = () => {
    const storedId = localStorage.getItem("id_usuario");
    if (storedId) return storedId;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id || user.id_usuario || "";
    } catch (err) {
      console.error("Error leyendo usuario de localStorage:", err);
      return "";
    }
  };
  const limitHistory = (rows) => (Array.isArray(rows) ? rows.slice(0, HISTORY_LIMIT) : []);
  const formatHistoryDate = (value) => {
    if (!value) return "";
    const [datePart] = String(value).split("T");
    const parts = datePart.split("-");
    if (parts.length !== 3) return value;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };
  const getDbDate = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  };
  const generateHistoryId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 10; i += 1) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  };

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const registerSavedFile = async (row) => {
    const payload = {
      archivos_exportar_id: generateHistoryId(),
      nombre_archivo: row.filename,
      fecha_subida: getDbDate(),
      estado: "GUARDADO",
      modulo: active.historyModule || active.id,
      usuario_sid: idUsuario() || "sistema",
    };

    const res = await fetch(`${API_URL}archivos_exportar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let message = "No se pudo registrar el archivo en historial.";
      try {
        const json = await res.json();
        message = json.message || json.error || message;
      } catch (err) {
        console.error("Error leyendo respuesta de historial:", err);
      }
      throw new Error(message);
    }

    return payload;
  };

  // Si cambian los módulos desde props y no hay ninguno seleccionado, elijo el primero
  useEffect(() => {
    if (!selectedModuleId && modules && modules.length > 0) {
      setSelectedModuleId(modules[0].id);
    }
    // si cambian los módulos pero el id seleccionado ya no existe, reubico al primero
    if (
      selectedModuleId &&
      !modules.some((m) => m.id === selectedModuleId) &&
      modules.length > 0
    ) {
      setSelectedModuleId(modules[0].id);
    }
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(TEST_MODE_STORAGE_KEY, String(isTestMode));
  }, [isTestMode]);

  // Cada vez que cambia el módulo seleccionado refresco el historial y reseteo selección
  useEffect(() => {
    fetchHistory();
    setFile(null);
    setStep(1);
    setValidationFeedback(null);
    setTemplateSelectionOpen(false);
    setSelectedTemplateOptions([]);
    setPendingTemplateOption("");
    setTemplateNivel("");
    setTemplateGrado("");
    setTemplateGrupo("");
    setTemplateNumeroEvaluaciones("1");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedModuleId]);

  useEffect(() => {
    if (!templateSelectionOpen || !templateSelectRef.current) return;

    let cancelled = false;

    async function initSelect2() {
      window.$ = $;
      window.jQuery = $;
      const select2Module = await import("select2/dist/js/select2.full");
      const attachSelect2 = select2Module.default || select2Module;
      if (typeof attachSelect2 === "function") {
        attachSelect2(window, $);
      }
      if (cancelled || !templateSelectRef.current) return;

      templateSelectRef.current.removeAttribute("multiple");
      const select = $(templateSelectRef.current);

      if (select.data("select2")) {
        select.select2("destroy");
      }

      select.select2({
        width: "100%",
        placeholder: usesSchoolGroupSelection ? "Busca un grupo" : "Busca una extracurricular",
        dropdownParent: $("#extracurricularTemplateModal"),
        allowClear: true,
      });

      select.val(pendingTemplateOption || "").trigger("change.select2");
      select.on("change.select2-template", () => {
        setPendingTemplateOption(select.val() || "");
      });
    }

    initSelect2().catch((err) => {
      console.error("Error inicializando Select2:", err);
    });

    return () => {
      cancelled = true;
      if (!templateSelectRef.current) return;
      const select = $(templateSelectRef.current);
      select.off(".select2-template");
      if (select.data("select2")) {
        select.select2("destroy");
      }
    };
  }, [
    templateSelectionOpen,
    templateOptions,
    selectedTemplateOptions,
    usesSchoolGroupSelection,
    templateNivel,
    templateGrado,
  ]);

  // --- Fetch historial ---
  // Yo intento traer el historial del endpoint si existe y no estoy en modo test.
  const fetchHistory = async () => {
    if (isPhpImport) {
      try {
        const historyModules = active.historyModules || [active.historyModule || active.id || ""];
        const params = new URLSearchParams({
          where: JSON.stringify({ modulo: { $in: historyModules } }),
          order: "fecha_subida",
          direction: "DESC",
        });
        const res = await fetch(`${API_URL}archivos_exportar?${params.toString()}`, {
          headers: authHeaders(),
          credentials: "include",
        });
        const json = await res.json();
        setHistory(
          limitHistory(
            (Array.isArray(json) ? json : []).sort(
              (a, b) => new Date(b.fecha_subida) - new Date(a.fecha_subida)
            )
          ).map((row) => ({
            id: row.archivos_exportar_id,
            filename: row.nombre_archivo,
            uploadedAt: formatHistoryDate(row.fecha_subida),
            status: row.estado,
            importId: null,
          }))
        );
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistory([]);
      }
      return;
    }

    if (active.historyUrl && !isTestMode) {
      try {
        const res = await fetch(active.historyUrl);
        const json = await res.json();
        setHistory(limitHistory(json));
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistory([]);
      }
    } else {
      // Simulación: creo algunos items de ejemplo sin eliminar los reales que pueda tener
      setHistory([]);
    }
  };

  const getFilenameFromHeaders = (res, fallbackName) => {
    const disposition = res.headers.get("content-disposition") || "";
    const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const plainMatch = disposition.match(/filename="?([^"]+)"?/i);
    const rawFilename = utfMatch?.[1] || plainMatch?.[1];

    if (!rawFilename) return fallbackName;

    try {
      return decodeURIComponent(rawFilename);
    } catch (err) {
      console.error("Error decodificando nombre de plantilla:", err);
      return rawFilename;
    }
  };

  const downloadPhpTemplate = async (url, fallbackName) => {
    setLoading(true);

    try {
      const res = await fetch(url.toString(), { credentials: "include" });
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json.msg || json.error || "No se pudo generar la plantilla."
        );
      }

      if (!res.ok) {
        throw new Error("No se pudo generar la plantilla.");
      }

      const blob = await res.blob();
      if (!blob.size) {
        throw new Error("La plantilla se genero vacia. Intenta de nuevo.");
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getFilenameFromHeaders(res, fallbackName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      setTemplateSelectionOpen(false);
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        err.message || "No se pudo descargar la plantilla."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Descargar plantilla ---
  // Si el endpoint PHP responde JSON de error, lo convierto en SweetAlert.
  const openTemplateSelection = async () => {
    setTemplateSelectionOpen(true);
    setTemplateOptionsLoading(true);
    setSelectedTemplateOptions([]);
    setPendingTemplateOption("");
    setTemplateNivel("");
    setTemplateGrado("");
    setTemplateGrupo("");
    setTemplateNumeroEvaluaciones("1");

    try {
      const url = new URL(active.phpEndpoint, window.location.origin);
      url.searchParams.set("accion", "opciones");
      url.searchParams.set("sid_instituto", sidInstituto());
      const res = await fetch(url.toString(), { credentials: "include" });
      const json = await res.json();

      if (json.status !== "ok") {
        throw new Error(
          json.msg ||
            (usesSchoolGroupSelection
              ? "No se pudieron cargar los grupos."
              : "No se pudieron cargar las extracurriculares.")
        );
      }

      setTemplateOptions(usesSchoolGroupSelection ? json.data || {} : Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        err.message ||
          (usesSchoolGroupSelection
            ? "Error al cargar los grupos."
            : "Error al cargar las extracurriculares.")
      );
      setTemplateSelectionOpen(false);
    } finally {
      setTemplateOptionsLoading(false);
    }
  };

  const nivelesTemplate = usesSchoolGroupSelection
    ? Array.isArray(templateOptions?.niveles)
      ? templateOptions.niveles
      : []
    : [];
  const selectedNivelTemplate = nivelesTemplate.find(
    (item) => item.id_nivel === templateNivel
  );
  const gradosTemplate = selectedNivelTemplate?.grados || [];
  const selectedGradoTemplate = gradosTemplate.find(
    (item) => item.id_grado === templateGrado
  );
  const gruposTemplate = selectedGradoTemplate?.grupos || [];
  const parsedTemplateNumeroEvaluaciones = Number(templateNumeroEvaluaciones);
  const hasValidTemplateNumeroEvaluaciones =
    Number.isInteger(parsedTemplateNumeroEvaluaciones) &&
    parsedTemplateNumeroEvaluaciones >= 1;
  const opcionesSelectTemplate = usesSchoolGroupSelection
    ? gruposTemplate
    : Array.isArray(templateOptions)
    ? templateOptions
    : [];

  const addTemplateOption = () => {
    if (!pendingTemplateOption) {
      showAlert("error", usesSchoolGroupSelection ? "Selecciona un grupo para agregar." : "Selecciona una extracurricular para agregar.");
      return;
    }

    if (isCalificacionesImport) {
      setTemplateGrupo(pendingTemplateOption);
      setSelectedTemplateOptions([pendingTemplateOption]);
      setPendingTemplateOption("");
      if (templateSelectRef.current) {
        $(templateSelectRef.current).val("").trigger("change");
      }
      return;
    }

    setSelectedTemplateOptions((prev) =>
      prev.includes(pendingTemplateOption) ? prev : [...prev, pendingTemplateOption]
    );
    setPendingTemplateOption("");

    if (templateSelectRef.current) {
      $(templateSelectRef.current).val("").trigger("change");
    }
  };

  const removeTemplateOption = (id) => {
    setSelectedTemplateOptions((prev) => prev.filter((item) => item !== id));
    if (isCalificacionesImport && templateGrupo === id) {
      setTemplateGrupo("");
    }
  };

  const getTemplateOptionName = (id) => {
    if (usesSchoolGroupSelection) {
      for (const nivel of nivelesTemplate) {
        for (const grado of nivel.grados || []) {
          const grupo = (grado.grupos || []).find((item) => item.id_grupo === id);
          if (grupo) {
            return `${nivel.nombre} / ${grado.nombre} / ${grupo.nombre}`;
          }
        }
      }
      return id;
    }

    return templateOptions.find((item) => item.id_extracurricular === id)?.nombre || id;
  };

  const downloadSelectedTemplate = async () => {
    const currentSelection = selectedTemplateOptions;

    if (isCalificacionesImport) {
      const numeroEvaluaciones = Number(templateNumeroEvaluaciones);
      if (!templateNivel || !templateGrado || !templateGrupo) {
        showAlert("error", "Selecciona nivel, grado y grupo.");
        return;
      }
      if (!Number.isInteger(numeroEvaluaciones) || numeroEvaluaciones < 1) {
        showAlert("error", "Indica un numero de evaluaciones valido.");
        return;
      }

      const url = new URL(active.phpEndpoint, window.location.origin);
      url.searchParams.set("accion", "plantilla");
      url.searchParams.set("sid_instituto", sidInstituto());
      url.searchParams.set("nivel_id", templateNivel);
      url.searchParams.set("grado_id", templateGrado);
      url.searchParams.set("grupo_id", templateGrupo);
      url.searchParams.set("numero_evaluaciones", String(numeroEvaluaciones));
      await downloadPhpTemplate(url, "plantilla_calificaciones.xlsx");
      return;
    }

    if (!currentSelection.length) {
      showAlert("error", isSeguimientosImport ? "Selecciona al menos un grupo." : "Selecciona al menos una extracurricular.");
      return;
    }

    const url = new URL(active.phpEndpoint, window.location.origin);
    url.searchParams.set("accion", "plantilla");
    url.searchParams.set("sid_instituto", sidInstituto());
    url.searchParams.set(
      isSeguimientosImport ? "grupo_ids" : "extracurricular_ids",
      currentSelection.join(",")
    );
    await downloadPhpTemplate(
      url,
      isSeguimientosImport
        ? "plantilla_seguimientos.xlsx"
        : "plantilla_extracurriculares.xlsx"
    );
  };

  const handleDownloadTemplate = async () => {
    if (usesTemplateSelection) {
      openTemplateSelection();
      return;
    }

    if (isPhpImport) {
      const url = new URL(active.phpEndpoint, window.location.origin);
      url.searchParams.set("accion", "plantilla");
      url.searchParams.set("sid_instituto", sidInstituto());
      await downloadPhpTemplate(url, `plantilla_${active.id || "datos"}.xlsx`);
      return;
    }

    if (active.templateUrl) {
      window.open(active.templateUrl, "_blank");
      return;
    }
    showAlert("error", "No hay plantilla configurada para este modulo.");
  };

  // --- Subir archivo ---
  // Yo envío el archivo al endpoint si existe y no estoy en modo test; en test creo entrada simulada.
  const handleUpload = async () => {
    if (!file) {
      showAlert("error", "Selecciona un archivo primero.");
      return;
    }
    setLoading(true);

    try {
      if (isPhpImport) {
        const fd = new FormData();
        fd.append("accion", "validar");
        fd.append("sid_instituto", sidInstituto());
        fd.append("datos_excel", file);

        const res = await fetch(active.phpEndpoint, {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        const json = await res.json();

        const row = {
          id: json.import_id || `php-${Date.now()}`,
          importId: json.import_id || null,
          filename: file.name,
          uploadedAt: new Date().toLocaleString(),
          status: json.status === "ok" ? "VALIDADO" : "ERROR",
          resumen: json.resumen || null,
          errores: json.errores || [],
          advertencias: json.advertencias || [],
          msg: json.msg || "",
        };

        setHistory((h) => limitHistory([row, ...h]));
        setStep(json.status === "ok" ? 3 : 2);

        if (json.status !== "ok") {
          if (row.errores.length) {
            setValidationFeedback(row);
          } else {
            showAlert("error", row.msg || "No se pudo validar el archivo.");
          }
        }

        return;
      }

      if (active.uploadUrl && !isTestMode) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(active.uploadUrl, { method: "POST", body: fd });
        const json = await res.json();
        const row = {
          id: json.id || Date.now(),
          filename: json.filename || file.name,
          uploadedAt: json.uploadedAt || new Date().toISOString(),
          status: json.status || "EN_VALIDACION",
          fileUrl: json.fileUrl || null,
        };
        setHistory((h) => limitHistory([row, ...h]));
        setStep(2);
      } else {
        // Simulación
        const row = {
          id: `sim-${Date.now()}`,
          filename: file.name,
          uploadedAt: new Date().toLocaleString(),
          status: "EN_VALIDACION",
        };
        setHistory((h) => limitHistory([row, ...h]));
        // avanzo visualmente al paso de validación
        setTimeout(() => setStep(2), 600);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error al subir el archivo.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
    }
  };

  // --- Validar archivo ---
  // Yo pido al backend que valide o simulo la validación. Actualizo el estado del historial.
  const handleValidate = async (rowId) => {
    if (isPhpImport) {
      const row = history.find((r) => r.id === rowId);
      if (row?.status === "ERROR" && row.errores?.length) {
        setValidationFeedback(row);
        return;
      }
      showAlert("info", "Este archivo ya se valido al subirlo.");
      return;
    }

    setLoading(true);
    try {
      if (active.validateUrl && !isTestMode) {
        const res = await fetch(`${active.validateUrl}?id=${rowId}`, {
          method: "POST",
        });
        const json = await res.json();
        setHistory((h) =>
          h.map((r) =>
            r.id === rowId ? { ...r, status: json.status || "VALIDADO" } : r
          )
        );
      } else {
        await new Promise((res) => setTimeout(res, 800));
        setHistory((h) =>
          h.map((r) => (r.id === rowId ? { ...r, status: "VALIDADO" } : r))
        );
      }
      setStep(3);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error en la validacion");
    } finally {
      setLoading(false);
    }
  };

  const notifyAfterPhpImport = async (json, row) => {
    if (active.id !== "seguimientos" && active.id !== "calificaciones") return;

    const endpoint =
      active.id === "seguimientos"
        ? "mobile/notificaciones/seguimientos/import/enviar"
        : "mobile/notificaciones/calificaciones/import/enviar";

    const payload =
      active.id === "seguimientos"
        ? {
            ids_asignar_atributo: Array.isArray(json.id) ? json.id : [],
            import_id: row.importId,
            sid_instituto: sidInstituto(),
            sid_grupos: selectedTemplateOptions,
          }
        : {
            import_id: row.importId,
            sid_instituto: sidInstituto(),
            sid_nivel: templateNivel,
            sid_grado: templateGrado,
            sid_grupo: templateGrupo || selectedTemplateOptions[0] || "",
          };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        console.error("Error en endpoint de notificacion", errorJson);
      }
    } catch (error) {
      console.error("No se pudo enviar la notificacion del importador", error);
    }
  };

  // --- Guardar en BD ---
  // Yo llamo al endpoint de guardado o simulo el guardado y actualizo la tabla.
  const handleSave = async (rowId) => {
    setLoading(true);
    try {
      if (isPhpImport) {
        const row = history.find((r) => r.id === rowId);
        if (!row?.importId) {
          showAlert("error", "Primero sube un archivo validado correctamente.");
          return;
        }

        const res = await fetch(active.phpEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "guardar",
            sid_instituto: sidInstituto(),
            id_usuario: idUsuario(),
            import_id: row.importId,
          }),
        });
        const json = await res.json();

        if (json.status !== "ok") {
          throw new Error(json.msg || "Error al guardar en BD");
        }

        try {
          await registerSavedFile(row);
          await fetchHistory();
        } catch (historyErr) {
          console.error(historyErr);
          showAlert(
            "error",
            historyErr.message || "Los datos se guardaron, pero no se pudo registrar el archivo."
          );
          return;
        }

        setHistory((h) =>
          h.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  status: "GUARDADO",
                  resumenGuardado: json.resumen,
                  msg: json.msg,
                }
              : r
          )
        );
        await notifyAfterPhpImport(json, row);
        showAlert("success", json.msg || "Datos guardados correctamente.");
        return;
      }

      if (active.saveUrl && !isTestMode) {
        const res = await fetch(`${active.saveUrl}?id=${rowId}`, {
          method: "POST",
        });
        const json = await res.json();
        setHistory((h) =>
          h.map((r) =>
            r.id === rowId ? { ...r, status: json.status || "GUARDADO" } : r
          )
        );
      } else {
        await new Promise((res) => setTimeout(res, 700));
        setHistory((h) =>
          h.map((r) => (r.id === rowId ? { ...r, status: "GUARDADO" } : r))
        );
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error al guardar en BD");
    } finally {
      setLoading(false);
    }
  };

  // --- Eliminar historial ---
  // Yo pregunto confirmación y remuevo el registro localmente.
  const handleDeleteHistory = async (id) => {
    const result = await showAlert("delete", "Eliminar el registro de carga?");
    if (!result?.isConfirmed) return;
    setHistory((h) => h.filter((r) => r.id !== id));
  };

  // --- Mostrar/abrir archivo si hay URL ---
  const handleOpenFile = (r) => {
    if (r.fileUrl) {
      window.open(r.fileUrl, "_blank");
      return;
    }
    showAlert("error", "No hay archivo disponible para descargar/ver.");
  };

  return (
    <div className="card shadow-sm mt-3">
      <div className="card-header bg-white" style={{ borderBottom: "0px" }}>
        <div className="mb-0 p-2 pb-0">
          <h3>Cargar Bases de Datos</h3>
          <p className="text-muted">
            Selecciona el módulo y sube el Excel correspondiente. La interfaz es
            la misma para todos los módulos.
          </p>
        </div>
      </div>

      <div className="card-body">
        {/* 1) Selector módulos (tabs) y botón requerimientos */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <ul className="nav nav-pills">
            {modules.map((m) => (
              <li key={m.id} className="nav-item me-2">
                <button
                  className={`nav-link ${
                    m.id === selectedModuleId ? "active" : ""
                  }`}
                  onClick={() => setSelectedModuleId(m.id)}
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Switch para modo test */}
            <div className="form-check form-switch me-2 mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="switchTestMode"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
              />
              <label
                className="form-check-label small "
                htmlFor="switchTestMode"
              >
                Modo test
              </label>
            </div>

            <button
              className="btn btn-secondary me-2 btn-sm mt-1"
              onClick={() => setShowReqModal(true)}
              data-bs-toggle="tooltip"
              title="Requerimientos y plantilla"
              style={{ padding: "5px 20px 0px" }}
            >
              <span className="material-icons me-1 " aria-hidden>
                info
              </span>
              <span style={{ position: "relative", top: "-6px" }}>
                Como subir datos
              </span>
            </button>

            <button
              className="btn btn-primary btn-sm mt-1"
              style={{ padding: "5px 20px 0px" }}
              onClick={handleDownloadTemplate}
              data-bs-toggle="tooltip"
              title="Descargar plantilla"
            >
              <span className="material-icons me-1 " aria-hidden>
                download
              </span>
              <span style={{ position: "relative", top: "-6px" }}>
                Descargar Plantilla
              </span>
            </button>
          </div>
        </div>

        {/* 2) Paso a paso visual */}
        <div className="row text-center mb-4">
          {[
            { key: 1, icon: "upload", title: "Subir Archivo" },
            { key: 2, icon: "document_scanner", title: "Validar Archivo" },
            { key: 3, icon: "task", title: "Guardar en la Base de Datos" },
          ].map((p) => (
            <div key={p.key} className="col-12 col-md-4 mb-2">
              <div
                className={`p-3 rounded shadow-sm d-flex flex-column align-items-center ${
                  step === p.key ? "border border-2 border-primary" : ""
                }`}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: step === p.key ? "#0d6efd" : "#f0f0f0",
                    color: step === p.key ? "white" : "#333",
                    marginBottom: 8,
                  }}
                >
                  <span className="material-icons">{p.icon}</span>
                </div>
                <small className="text-muted">Paso {p.key}:</small>
                <strong className="mt-1">{p.title}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* 3) Zona de subida */}
        <div
          className="row align-items-center mb-3 pt-3 pb-2"
          style={{ borderTop: "1px dotted black" }}
        >
          <div className="col-md-6">
            <label className="form-label small d-block">Archivo Excel</label>
            <input
              ref={fileInputRef}
              id="dataUploadFileInput"
              type="file"
              accept={
                active && active.id === "fotos"
                  ? ".zip,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
                  : isPhpImport
                  ? ".xlsx"
                  : ".xlsx,.xls,.csv"
              }
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="d-none"
            />
            <label
              htmlFor="dataUploadFileInput"
              className="d-flex align-items-center justify-content-between gap-3 border border-primary rounded px-3 py-3 bg-light"
              style={{ cursor: "pointer", minHeight: 58 }}
            >
              <span className="d-flex align-items-center p-0 text-primary fw-semibold">
                <span className="material-icons">upload_file</span>
                Seleccionar archivo
              </span>
              <span className="text-muted text-truncate">
                {file ? file.name : "Ningun archivo seleccionado"}
              </span>
            </label>
            <div className="form-text">
              Selecciona el archivo que quieres subir para{" "}
              <strong>{active.label}</strong>.
            </div>
          </div>

          <div className="col-md-3 text-end">
            <button
              className="btn btn-success w-100 btn-sm mt-1"
              style={{ padding: "5px 20px 0px" }}
              onClick={handleUpload}
              disabled={!file || loading}
            >
              <span className="material-icons me-1">cloud_upload</span>
              <span style={{ position: "relative", top: "-6px" }}>Subir</span>
            </button>
          </div>

          <div className="col-md-3 text-end">
            <button
              className="btn btn-outline-secondary btn-sm mt-1"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={loading}
              data-bs-toggle="tooltip"
              title="Limpiar selección"
              style={{ padding: "5px 20px 0px" }}
            >
              <span className="material-icons">close</span>
              <span style={{ position: "relative", top: "-6px" }}>Limpiar</span>
            </button>
          </div>
        </div>

        {/* 4) Tabla historial */}
        <div
          className="table-responsive pt-4"
          style={{ borderTop: "1px dotted black" }}
        >
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha De Subida</th>
                <th>Archivo</th>
                <th>Estado</th>
                <th style={{ width: 220 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No hay cargas todavía para{" "}
                    <strong>{active.label || "—"}</strong>.
                  </td>
                </tr>
              )}

              {history.map((r) => (
                <tr key={r.id}>
                  <td style={{ width: 170 }}>{r.uploadedAt}</td>
                  <td>
                    <div>{r.filename}</div>
                    {r.resumen && (
                      <small className="text-muted">
                        Filas: {r.resumen.filas ?? 0}
                        {r.resumen.padres ? ` | Padres: ${r.resumen.padres}` : ""}
                        {r.resumen.alumnos ? ` | Alumnos: ${r.resumen.alumnos}` : ""}
                        {r.resumen.asignaciones
                          ? ` | Asignaciones: ${r.resumen.asignaciones}`
                          : ""}
                        {r.resumen.nuevas ? ` | Nuevas: ${r.resumen.nuevas}` : ""}
                        {r.resumen.duplicados_existentes
                          ? ` | Ya existentes: ${r.resumen.duplicados_existentes}`
                          : ""}
                        {r.resumen.errores ? ` | Errores: ${r.resumen.errores}` : ""}
                      </small>
                    )}
                    {r.status === "ERROR" && r.errores?.length > 0 && (
                      <div className="small text-danger mt-1">
                        {r.errores
                          .slice(0, 2)
                          .map((e) => `Fila ${e.fila} ${e.columna}: ${e.mensaje}`)
                          .join(" | ")}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "GUARDADO"
                          ? "bg-success"
                          : r.status === "ERROR"
                          ? "bg-danger"
                          : r.status === "VALIDADO"
                          ? "bg-info"
                          : "bg-secondary"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        style={{ padding: "5px 20px 0px", height: "40px" }}
                        onClick={() => handleValidate(r.id)}
                        disabled={
                          loading ||
                          r.status === "VALIDADO" ||
                          r.status === "GUARDADO"
                        }
                      >
                        <span style={{ position: "relative", top: "-3px" }}>
                          Validar
                        </span>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-success"
                        style={{ padding: "5px 20px 0px", height: "40px" }}
                        onClick={() => handleSave(r.id)}
                        disabled={
                          loading ||
                          r.status === "GUARDADO" ||
                          r.status === "ERROR" ||
                          (isPhpImport && !r.importId)
                        }
                      >
                        <span style={{ position: "relative", top: "-3px" }}>
                          Guardar
                        </span>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        style={{ padding: "5px 20px 0px", height: "40px" }}
                        onClick={() => handleDeleteHistory(r.id)}
                      >
                        <span style={{ position: "relative", top: "-3px" }}>
                          Eliminar
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Requerimientos: ahora es un POPUP con texto e imágenes explicativas (si el módulo las provee) */}
        {showReqModal && (
          <Modal
            isOpen={showReqModal}
            title={`Como subir datos - ${activeRequirements.titulo || active.label || ""}`}
            size="lg"
            onClose={() => setShowReqModal(false)}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-icons text-primary">
                  {activeRequirements.icono || "info"}
                </span>
                <h6 className="mb-0">{activeRequirements.titulo || active.label}</h6>
              </div>

              {requirementSteps.length > 0 ? (
                <ol className="ps-3 mb-4">
                  {requirementSteps.map(([key, text]) => (
                    <li key={key} className="mb-2">
                      {text}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mb-0">No hay instrucciones configuradas para este modulo.</p>
              )}

              {requirementImages.length > 0 && (
                <div className="row">
                  {requirementImages.map(([key, src], idx) => (
                    <div key={key} className="col-12 col-md-6 mb-3">
                      <div className="border rounded p-2 h-100">
                        <img
                          src={src}
                          alt={`${activeRequirements.titulo || active.label} ${key}`}
                          style={{ width: "100%", objectFit: "contain" }}
                        />
                        <div className="small text-muted mt-2">
                          Imagen {idx + 1}: coloca este archivo en {src}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </Modal>
        )}

        {false && showReqModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => setShowReqModal(false)}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Requerimientos y plantilla — {active.label}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReqModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Texto explicativo: lo muestro tal cual viene en requirementsText */}
                  <p className="mb-2">
                    {active.requirementsText ||
                      "No hay instrucciones configuradas para este módulo."}
                  </p>

                  {/* Si el módulo provee imágenes explicativas, las muestro en un grid */}
                  {Array.isArray(active.requirementsImages) &&
                    active.requirementsImages.length > 0 && (
                      <div className="row mt-3">
                        {active.requirementsImages.map((src, idx) => (
                          <div key={idx} className="col-12 col-md-6 mb-3">
                            <div className="card">
                              <img
                                src={src}
                                alt={`preview-${idx}`}
                                style={{ width: "100%", objectFit: "contain" }}
                              />
                              <div className="card-body small text-muted">
                                Imagen {idx + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  <hr />

                  {/* Mostrar enlace de descarga solo como acción adicional, no es el contenido principal del modal */}
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    style={{ padding: "5px 20px 0px" }}
                    onClick={handleDownloadTemplate}
                    data-bs-toggle="tooltip"
                    title="Descargar plantilla"
                  >
                    <span className="material-icons me-1 " aria-hidden>
                      download
                    </span>
                    <span style={{ position: "relative", top: "-6px" }}>
                      Descargar Plantilla
                    </span>
                  </button>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowReqModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {templateSelectionOpen && (
          <div
            id="extracurricularTemplateModal"
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={(event) => {
              if (isCalificacionesImport) return;
              if (event.target === event.currentTarget) {
                setTemplateSelectionOpen(false);
              }
            }}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {usesSchoolGroupSelection
                      ? isCalificacionesImport
                        ? "Parametros de calificaciones"
                        : "Seleccionar grupos"
                      : "Seleccionar extracurriculares"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTemplateSelectionOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted mb-3">
                    {usesSchoolGroupSelection
                      ? isCalificacionesImport
                        ? "Elige un salon y el numero de evaluaciones. La plantilla usara el ciclo en curso."
                        : "Elige uno o varios salones. La plantilla incluira los alumnos de esos grupos y todos los atributos registrados."
                      : "Elige las actividades que quieres incluir como columnas en la plantilla."}
                  </p>

                  {isCalificacionesImport && (
                    <div className="alert alert-light border small">
                      Ciclo en curso:{" "}
                      <strong>{templateOptions?.ciclo?.nombre || "No disponible"}</strong>
                    </div>
                  )}

                  {usesSchoolGroupSelection && (
                    <div className="row mb-3">
                      <div className={isCalificacionesImport ? "col-12 col-md-4 mb-2" : "col-12 col-md-6 mb-2"}>
                        <label className="form-label">Nivel</label>
                        <select
                          className="form-control"
                          disabled={templateOptionsLoading || hasCalificacionesGroupSelected}
                          value={templateNivel}
                          onChange={(event) => {
                            setTemplateNivel(event.target.value);
                            setTemplateGrado("");
                            setTemplateGrupo("");
                            if (isCalificacionesImport) {
                              setSelectedTemplateOptions([]);
                            }
                            setPendingTemplateOption("");
                          }}
                        >
                          <option value="">Selecciona nivel...</option>
                          {nivelesTemplate.map((nivel) => (
                            <option key={nivel.id_nivel} value={nivel.id_nivel}>
                              {nivel.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={isCalificacionesImport ? "col-12 col-md-4 mb-2" : "col-12 col-md-6 mb-2"}>
                        <label className="form-label">Grado</label>
                        <select
                          className="form-control"
                          disabled={
                            templateOptionsLoading ||
                            !templateNivel ||
                            hasCalificacionesGroupSelected
                          }
                          value={templateGrado}
                          onChange={(event) => {
                            setTemplateGrado(event.target.value);
                            setTemplateGrupo("");
                            if (isCalificacionesImport) {
                              setSelectedTemplateOptions([]);
                            }
                            setPendingTemplateOption("");
                          }}
                        >
                          <option value="">Selecciona grado...</option>
                          {gradosTemplate.map((grado) => (
                            <option key={grado.id_grado} value={grado.id_grado}>
                              {grado.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {isCalificacionesImport && (
                        <div className="col-12 col-md-4 mb-2">
                          <label className="form-label">Grupo</label>
                          <select
                            ref={templateSelectRef}
                            className="form-control"
                            disabled={
                              templateOptionsLoading ||
                              !templateGrado ||
                              hasCalificacionesGroupSelected
                            }
                            value={pendingTemplateOption}
                            onChange={(event) =>
                              setPendingTemplateOption(event.target.value)
                            }
                          >
                            <option value="">Busca y selecciona...</option>
                            {opcionesSelectTemplate
                              .filter((item) => !selectedTemplateOptions.includes(item.id_grupo))
                              .map((item) => (
                                <option key={item.id_grupo} value={item.id_grupo}>
                                  {item.nombre}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {!isCalificacionesImport && (
                    <>
                      <label className="form-label">
                        {usesSchoolGroupSelection ? "Grupo" : "Extracurriculares"}
                      </label>
                      <div className="d-flex gap-2 align-items-start">
                        <div className="flex-grow-1">
                          <select
                            ref={templateSelectRef}
                            className="form-control"
                            disabled={
                              templateOptionsLoading ||
                              (usesSchoolGroupSelection && !templateGrado)
                            }
                            value={pendingTemplateOption}
                            onChange={(event) =>
                              setPendingTemplateOption(event.target.value)
                            }
                          >
                            <option value="">Busca y selecciona...</option>
                            {opcionesSelectTemplate
                              .filter(
                                (item) =>
                                  !selectedTemplateOptions.includes(
                                    usesSchoolGroupSelection
                                      ? item.id_grupo
                                      : item.id_extracurricular
                                  )
                              )
                              .map((item) => (
                                <option
                                  key={usesSchoolGroupSelection ? item.id_grupo : item.id_extracurricular}
                                  value={usesSchoolGroupSelection ? item.id_grupo : item.id_extracurricular}
                                >
                                  {item.nombre}
                                </option>
                              ))}
                          </select>
                        </div>
                        <button
                          className="btn btn-outline-primary"
                          onClick={addTemplateOption}
                          disabled={templateOptionsLoading || !pendingTemplateOption}
                        >
                          Agregar
                        </button>
                      </div>
                    </>
                  )}

                  {isCalificacionesImport && (
                    <div className="row mt-3 align-items-end">
                      <div className="col-12 col-md-6 mb-2">
                        <label className="form-label">Numero de evaluaciones</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-control"
                          value={templateNumeroEvaluaciones}
                          onChange={(event) =>
                            setTemplateNumeroEvaluaciones(event.target.value)
                          }
                        />
                      </div>
                      <div className="col-12 col-md-6 mb-2">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={addTemplateOption}
                          disabled={
                            templateOptionsLoading ||
                            !pendingTemplateOption ||
                            hasCalificacionesGroupSelected
                          }
                        >
                          Seleccionar
                        </button>
                      </div>
                    </div>
                  )}

                  {templateOptionsLoading && (
                    <div className="text-muted small mt-2">Cargando opciones...</div>
                  )}

                  {!templateOptionsLoading && opcionesSelectTemplate.length === 0 && (
                    <div className="text-danger small mt-2">
                      {isSeguimientosImport
                        ? "Selecciona nivel y grado para ver los grupos disponibles."
                        : isCalificacionesImport
                        ? "Selecciona nivel y grado para ver los grupos disponibles."
                        : "No hay extracurriculares registradas para esta institucion."}
                    </div>
                  )}

                  <div className="mt-4">
                    <h6 className="mb-2">
                      {usesSchoolGroupSelection ? "Grupo seleccionado" : "Extracurriculares seleccionadas"}
                    </h6>
                    {selectedTemplateOptions.length === 0 ? (
                      <div className="text-muted small">
                        {usesSchoolGroupSelection
                          ? "Todavia no has agregado grupo."
                          : "Todavia no has agregado extracurriculares."}
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {selectedTemplateOptions.map((id) => (
                          <span
                            key={id}
                            className="badge bg-primary d-inline-flex align-items-center gap-2"
                            style={{ fontSize: 13, padding: "8px 10px" }}
                          >
                            {getTemplateOptionName(id)}
                            <button
                              type="button"
                              className="btn-close btn-close-white"
                              aria-label="Quitar"
                              style={{ fontSize: 10 }}
                              onClick={() => removeTemplateOption(id)}
                            ></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setTemplateSelectionOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={downloadSelectedTemplate}
                    disabled={
                      templateOptionsLoading ||
                      !selectedTemplateOptions.length ||
                      (isCalificacionesImport &&
                        (!templateOptions?.ciclo ||
                          !hasValidTemplateNumeroEvaluaciones))
                    }
                  >
                    Descargar plantilla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {validationFeedback && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => setValidationFeedback(null)}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Errores de validacion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setValidationFeedback(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted mb-3">
                    Corrige estas celdas en el Excel y vuelve a subir el archivo.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Celda</th>
                          <th>Valor</th>
                          <th>Error</th>
                          <th>Como corregirlo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(validationFeedback.errores || []).map((error, idx) => (
                          <tr key={idx}>
                            <td>
                              {error.fila ? `Fila ${error.fila}` : "Archivo"}
                              {error.columna ? `, ${error.columna}` : ""}
                            </td>
                            <td>{error.valor || "-"}</td>
                            <td>{error.mensaje}</td>
                            <td>{error.correccion || "Revisa la plantilla y corrige el dato."}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setValidationFeedback(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
