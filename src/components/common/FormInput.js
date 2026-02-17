import React from "react";
import "../../styles/Form.css";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  disabled = false,
  min,
  max,
  options = [],
  rows = 4,
}) => {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={error ? "error" : ""}
          />
        );

      case "select":
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={error ? "error" : ""}
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "file":
        return (
          <input
            type="file"
            name={name}
            onChange={onChange}
            required={required}
            disabled={disabled}
            accept="image/*"
            className={error ? "error" : ""}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            className={error ? "error" : ""}
          />
        );
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormInput;
