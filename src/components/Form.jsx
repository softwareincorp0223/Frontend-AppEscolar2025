import React, { useState, useEffect } from "react";

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
    } else {
      setFormValues({});
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    // fields.forEach((field) => {
    //   if (field.required && !formValues[field.name]) {
    //     newErrors[field.name] = "Este campo es obligatorio";
    //   }
    // });

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
    if (onSubmit) onSubmit(formValues);

    // 🔹 Limpiar el formulario después de enviar (solo si es creación)
    // if (!initialValues || Object.keys(initialValues).length === 0) {
    //   setFormValues({});
    //   e.target.reset();
    // }

    if (!initialValues) {
      setFormValues({});
      e.target.reset();
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

                {/* {field.type === "select" ? (
                  <select
                    className={`form-select ${errors[field.name] ? "is-invalid" : ""
                      }`}
                    id={field.name}
                    name={field.name}
                    value={formValues[field.name] || ""}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      {field.placeholder || "Seleccione..."}
                    </option>
                    {field.options?.map((option, i) => (
                      <option
                        key={i}
                        value={
                          typeof option === "object" ? option.value : option
                        }
                      >
                        {typeof option === "object" ? option.label : option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={`form-control ${errors[field.name] ? "is-invalid" : ""
                      }`}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type || "text"}
                    value={formValues[field.name] || ""}
                    onChange={handleChange}
                  />
                )} */}

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
                    className={`form-select ${errors[field.name] ? "is-invalid" : ""
                      }`}
                    name={field.name}
                    value={formValues[field.name] ?? ""}
                    disabled={field.disabled}
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
                      className={`form-check-input ${errors[field.name] ? "is-invalid" : ""
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

                ) : (
                  <input
                    className={`form-control ${errors[field.name] ? "is-invalid" : ""
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
              className={`btn ${title.includes("Editar") ? "btn-primary" : "btn-success"
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
