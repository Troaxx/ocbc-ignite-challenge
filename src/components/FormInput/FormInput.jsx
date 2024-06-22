import React from "react";
import './FormInput.css';

const FormInput = ({ label, type, value, onChange, name, className }) => {
  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;