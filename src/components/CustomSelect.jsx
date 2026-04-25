export default function CustomSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  optionValue = "id",
  optionLabel = "nombre",
  placeholder = "Selecciona una opción",
  disabled = false,
}) {
  return (
    <div className="mt-3">
      <label>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        disabled={disabled}
      >
        <option value="0">{placeholder}</option>

        {options.map((item) => (
          <option key={item[optionValue]} value={item[optionValue]}>
            {item[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}