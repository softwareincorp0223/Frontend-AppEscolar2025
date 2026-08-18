import React, { useState, useEffect } from "react";
import $ from "jquery";
import select2Factory from "select2";
import "select2/dist/css/select2.min.css";

select2Factory(window, $);

export default function Form({
  title,
  fields,
  onSubmit,
  columns = 2,
  initialValues = null,
}) {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});

  // 🔹 Actualizar valores cuando cambien los initialValues

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    const selects = $(".form-select2-control");

    selects.each(function initSelect2() {
      const select = $(this);

      if (select.data("select2")) {
        select.select2("destroy");
      }

      select.select2({
        width: "100%",
        placeholder: select.data("placeholder") || "Seleccione...",
        allowClear: !select.prop("required"),
      });

      select.on("change.form-select2", (event) => {
        const field = fields.find((item) => item.name === event.target.name);

        handleChange(event);
        field?.onChange?.(event);
      });
    });

    return () => {
      selects.each(function destroySelect2() {
        const select = $(this);
        select.off("change.form-select2");
        if (select.data("select2")) {
          select.select2("destroy");
        }
      });
    };
  }, [fields]);

  useEffect(() => {
    $(".form-select2-control").each(function syncSelect2Value() {
      const select = $(this);
      const name = select.attr("name");
      select.val(formValues[name] || "").trigger("change.select2");
    });
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    fields.forEach((field) => {
      const value = formValues[field.name];

      if (
        field.required &&
        (value === undefined || value === null || value === "")
      ) {
        newErrors[field.name] = "Este campo es obligatorio";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      if (onSubmit) await onSubmit(formValues);
      setFormValues({});
      e.target.reset();
    } catch (error) {
      console.error("[Form submit]", error);
    }
  };

  const colClass = `col-md-${12 / columns} mb-4`;

  return (
    <div className="card mb-4 mb-lg-4">
      <div className="card-body p-4 p-lg-4">
        <h2 className="card-title fs-5 mb-4">{title}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            {fields.map((field, index) => (
              <div className={colClass} key={index}>
                <label className="form-label" htmlFor={field.name}>
                  {field.label}
                  {field.required && (
                    <span className="text-danger ms-1">*</span>
                  )}
                </label>

                {field.type === "custom" && field.component ? (
                  field.component({
                    name: field.name,
                    value: formValues[field.name],
                    onChange: (val) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [field.name]: val,
                      })),
                    setFormValues,
                    error: errors[field.name],
                  })
                ) : field.type === "select" ? (
                  <select
                    className={`form-select ${
                      field.select2 ? "form-select2-control " : ""
                    }${
                      errors[field.name] ? "is-invalid" : ""
                    }`}
                    id={field.name}
                    name={field.name}
                    value={formValues[field.name] ?? ""}
                    disabled={field.disabled}
                    required={field.required}
                    data-placeholder={field.placeholder || "Seleccione..."}
                    onChange={(e) => {
                      handleChange(e);
                      field.onChange && field.onChange(e);
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  //  CHECKBOX (caso especial)
                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      type="checkbox"
                      name={field.name}
                      checked={!!formValues[field.name]}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        // 1️⃣ Actualiza el estado interno del Form
                        setFormValues((prev) => ({
                          ...prev,
                          [field.name]: checked,
                        }));

                        // 2️⃣ Ejecuta el onChange personalizado si existe
                        if (field.onChange) {
                          field.onChange(e);
                        }
                      }}
                    />
                  </div>
                ) : field.type === "file" ? (
                  <input
                    className={`form-control ${
                      errors[field.name] ? "is-invalid" : ""
                    }`}
                    type="file"
                    name={field.name}
                    accept={field.accept}
                    multiple={field.multiple}
                    onChange={(e) => {
                      setFormValues((prev) => ({
                        ...prev,
                        [field.name]: field.multiple
                          ? Array.from(e.target.files)
                          : e.target.files[0],
                      }));

                      if (field.onChange) {
                        field.onChange(e);
                      }
                    }}
                  />
                ) : field.type === "image-select" ? (
                  <div className="d-flex flex-wrap gap-2">
                    {field.options.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() =>
                          handleChange({
                            target: { name: field.name, value: opt.value },
                          })
                        }
                        style={{
                          border:
                            formValues[field.name] === opt.value
                              ? "2px solid #007bff"
                              : "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <img src={opt.image} width={40} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    className={`form-control ${
                      errors[field.name] ? "is-invalid" : ""
                    }`}
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formValues[field.name] ?? ""}
                    onChange={handleChange}
                  />
                )}

                {errors[field.name] && (
                  <div className="invalid-feedback">{errors[field.name]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-end">
            <button
              className={`btn ${
                title.includes("Editar") ? "btn-primary" : "btn-success"
              } py-2`}
              type="submit"
            >
              {title.includes("Editar") ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
