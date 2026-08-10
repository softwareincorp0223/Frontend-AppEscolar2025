import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import $ from "jquery";
import "datatables.net-bs5";
import { createRoot } from "react-dom/client";
import "../index.css";
import Loader from "../functions/general/Loader";

export default function Table({
  id,
  title,
  columns,
  data = [],
  renderActions,
  headerButtons,
  showCheckbox = false,
  onSelectionChange,
  loading = false,
}) {
  const tableRef = useRef(null);
  const dtRef = useRef(null);
  const rootsRef = useRef(new Map());
  const selectedIdsRef = useRef(new Set());

  // 🔹 Maneja selección
  const handleSelect = (checked, idValue) => {
    if (!idValue) return;

    if (checked) selectedIdsRef.current.add(idValue);
    else selectedIdsRef.current.delete(idValue);

    const selected = Array.from(selectedIdsRef.current);
    onSelectionChange?.(selected);
  };

  // 🔹 Detecta automáticamente la key del ID
  const getRowIdKey = (rowData) => {
    if (!rowData || typeof rowData !== "object") return null;
    if ("id" in rowData) return "id";
    return Object.keys(rowData).find((k) =>
      k.toLowerCase().startsWith("id_")
    );
  };

  /* =========================
     INIT DATATABLE
  ========================== */
  useEffect(() => {
    const $table = $(tableRef.current);

    // const columnsDef = columns.map((col) => ({
    //   title: col.label,
    //   data: col.key,
    // }));

    const columnsDef = columns.map((col) => ({
      title: col.label,
      data: col.key,
      render: col.render
        ? function (data, type, row) {
          return col.render(row);
        }
        : undefined,
    }));

    if (showCheckbox) {
      columnsDef.unshift({
        title: "✔",
        data: null,
        orderable: false,
        searchable: false,
      });
    }

    if (renderActions) {
      columnsDef.push({
        title: "Acciones",
        data: null,
        orderable: false,
        searchable: false,
      });
    }

    dtRef.current = $table.DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      },
      autoWidth: false,
      data,
      columns: columnsDef,

      createdRow: function (row, rowData, rowIndex) {
        // 🔹 Detectar ID UNA SOLA VEZ
        const idKey = getRowIdKey(rowData);
        const idValue = idKey ? rowData[idKey] : null;

        // 🔹 Checkbox
        if (showCheckbox) {
          const $cell = $("td", row).eq(0);
          $cell.html(
            `<input type="checkbox" class="row-checkbox" data-id="${idValue ?? ""}" />`
          );
        }

        // 🔹 Acciones
        if (renderActions) {
          const $lastCell = $("td", row).last();
          const container = document.createElement("div");
          container.className = "d-flex justify-content-end";
          $lastCell.empty().append(container);

          const key = idValue ?? `row-${rowIndex}`;

          if (rootsRef.current.has(key)) {
            try {
              rootsRef.current.get(key).unmount();
            } catch { }
            rootsRef.current.delete(key);
          }

          const root = createRoot(container);
          root.render(renderActions(rowData));
          rootsRef.current.set(key, root);
        }
      },
    });

    // 🔹 Evento delegado
    if (showCheckbox) {
      $table.on("change", "tbody input[type='checkbox']", function (e) {
        handleSelect(e.target.checked, $(this).data("id"));
      });
    }

    return () => {
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch { }
      });
      rootsRef.current.clear();

      if (dtRef.current) {
        dtRef.current.destroy(true);
        dtRef.current = null;
      }

      if (showCheckbox) {
        $table.off("change", "tbody input[type='checkbox']");
      }
    };
  }, [id, showCheckbox]);

  /* =========================
     UPDATE DATA
  ========================== */
  useEffect(() => {
    if (!dtRef.current) return;

    rootsRef.current.forEach((root) => {
      try {
        root.unmount();
      } catch { }
    });
    rootsRef.current.clear();

    selectedIdsRef.current.clear();

    dtRef.current.clear();
    dtRef.current.rows.add(Array.isArray(data) ? data : []);
    dtRef.current.draw(false);
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

        <div className="table-responsive position-relative" style={{ minHeight: loading ? 240 : undefined }}>
          {loading && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center"
              style={{ zIndex: 2 }}
            >
              <Loader title="Cargando datos..." titleClass="fs-6" />
            </div>
          )}
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
                  <th className="text-end fw-medium text-secondary">
                    Acciones
                  </th>
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
