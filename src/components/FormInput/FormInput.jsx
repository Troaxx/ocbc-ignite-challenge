import React from "react";

import './FormInput.css';

const FormInput = ({ label, type, value, onChange, className }) => {
  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;