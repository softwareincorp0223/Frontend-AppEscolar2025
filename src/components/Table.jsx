import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import $ from "jquery";
import "datatables.net-bs5";
import { createRoot } from "react-dom/client";
import "../index.css";

export default function Table({
  id,
  title,
  columns, // [{ label: "Nombre", key: "nombre" }, ...]
  data = [],
  renderActions,
  headerButtons,
  showCheckbox = false,
  onSelectionChange, // 🔹 Nuevo callback opcional
}) {
  const tableRef = useRef(null);
  const dtRef = useRef(null);
  const rootsRef = useRef(new Map());
  const selectedIdsRef = useRef(new Set());

  // 🔹 Maneja selección de checkboxes
  const handleSelect = (checked, idValue) => {
    if (!idValue) return;

    if (checked) selectedIdsRef.current.add(idValue);
    else selectedIdsRef.current.delete(idValue);

    const selected = Array.from(selectedIdsRef.current);
    console.log("Seleccionados:", selected);

    if (onSelectionChange) onSelectionChange(selected);
  };

  // 🔹 Inicialización del DataTable
  useEffect(() => {
    const $table = $(tableRef.current);
    const languageConfig = {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    };

    // Configuración de columnas base
    const columnsDef = columns.map((col) => ({
      title: col.label,
      data: col.key,
    }));

    // 🔹 Insertar columna de checkboxes si está activado
    if (showCheckbox) {
      columnsDef.unshift({
        title: "✔",
        data: null,
        orderable: false,
        searchable: false,
      });
    }

    // 🔹 Insertar columna de acciones si existe renderActions
    if (renderActions) {
      columnsDef.push({
        title: "Acciones",
        data: null,
        orderable: false,
        searchable: false,
      });
    }

    // Inicializar DataTable
    dtRef.current = $table.DataTable({
      language: languageConfig,
      autoWidth: false,
      data,
      columns: columnsDef,
      createdRow: function (row, rowData, rowIndex) {
        // 🔹 Checkbox
        if (showCheckbox) {
          const checkboxIndex = 0;
          const idValue =
            rowData.id_padre ?? rowData.id_usuario ?? rowData.id ?? ""; // Ajusta según tu campo real

          const $cell = $("td", row).eq(checkboxIndex);
          $cell.html(
            `<input type="checkbox" class="row-checkbox" data-id="${idValue}" />`
          );
        }

        // 🔹 Acciones (JSX)
        if (renderActions) {
          const $lastCell = $("td", row).last();
          const container = document.createElement("div");
          container.className = "d-flex justify-content-end";
          $lastCell.empty().append(container);

          const key =
            rowData.id_padre ?? rowData.id_usuario ?? rowData.id ?? `row-${rowIndex}`;

          if (rootsRef.current.has(key)) {
            try {
              rootsRef.current.get(key).unmount();
            } catch {}
            rootsRef.current.delete(key);
          }

          const root = createRoot(container);
          root.render(renderActions(rowData));
          rootsRef.current.set(key, root);
        }
      },
    });

    // 🔹 Evento delegado para checkboxes
    if (showCheckbox) {
      $table.on("change", "tbody input[type='checkbox']", function (e) {
        handleSelect(e.target.checked, $(this).attr("data-id"));
      });
    }

    return () => {
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch {}
      });
      rootsRef.current.clear();

      if (dtRef.current) {
        dtRef.current.destroy(true);
        dtRef.current = null;
      }

      if (showCheckbox) $table.off("change", "tbody input[type='checkbox']");
    };
  }, [id, showCheckbox]);

  // 🔹 Actualizar tabla al cambiar `data`
  useEffect(() => {
    if (dtRef.current) {
      // limpiar renders previos
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch {}
      });
      rootsRef.current.clear();

      // limpiar selección
      selectedIdsRef.current.clear();

      // actualizar filas
      dtRef.current.clear();
      const safeData = Array.isArray(data) ? data : [];
      dtRef.current.rows.add(safeData);
      dtRef.current.draw(false);

      // volver a asignar evento de checkbox
      if (showCheckbox) {
        $(tableRef.current).off("change", "tbody input[type='checkbox']");
        $(tableRef.current).on("change", "tbody input[type='checkbox']", function (e) {
          handleSelect(e.target.checked, $(this).attr("data-id"));
        });
      }
    }
  }, [data]);

  return (
    <div className="card mb-3">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title fs-5 mb-0">{title}</h2>
          <div className="d-flex gap-2">
            {headerButtons && headerButtons()}
          </div>
        </div>

        <div className="table-responsive">
          <table
            ref={tableRef}
            id={id}
            className="table table-hover align-middle mb-0 uniform-table"
          >
            <thead>
              <tr>
                {showCheckbox && <th>✔</th>}
                {columns.map((col, i) => (
                  <th key={i} className="fw-medium text-secondary">
                    {col.label}
                  </th>
                ))}
                {renderActions && (
                  <th className="text-end fw-medium text-secondary">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
      </div>
    </div>
  );
}
