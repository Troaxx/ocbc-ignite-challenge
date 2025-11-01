import React from "react";
import './FormInput.css';

const FormInput = ({ label, type, value, onChange, name, className, placeholder }) => {
  const id = name || label?.toLowerCase?.().replace(/\s+/g, '-') || undefined;
  return (
    <div className={`input-group ${className || ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  );
};

export default FormInput;