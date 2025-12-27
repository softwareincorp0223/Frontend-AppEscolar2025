import React, { useEffect, useState } from "react";
import { InstitutoData, InstitutoDataFilter } from "./DataActions";

export function SelectField({
  label,
  name,
  value,
  onChange,
  disabled = false,
  options = null,        // 👈 fuente externa
  load = null,           // "nivel" | "grado" | "grupo"
  dependencia = null,
  error = null,
}) {
  const [internalOptions, setInternalOptions] = useState([]);

  useEffect(() => {
    async function loadData() {
      // 🔥 SI vienen options por props → NO cargar nada
      if (options) return;

      if (!load) return;

      try {
        let data = [];

        if (load === "nivel") {
          data = await InstitutoData("nivel/");
        }

        if (load === "grado" && dependencia) {
          data = await InstitutoDataFilter(
            `grado?sid_nivel=${dependencia}`
          );
        }

        if (load === "grupo" && dependencia) {
          data = await InstitutoDataFilter(
            `grupo?sid_grado=${dependencia}`
          );
        }

        setInternalOptions(
          data.map((item) => ({
            value: String(
              item.id_nivel || item.id_grado || item.id_grupo
            ),
            label: item.nombre,
          }))
        );
      } catch (err) {
        console.error("Error cargando SelectField:", err);
      }
    }

    loadData();
  }, [load, dependencia, options]);

  // 🔑 UNA SOLA FUENTE FINAL
  const finalOptions = options ?? internalOptions;

  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}

      <select
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Seleccione...</option>

        {finalOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
