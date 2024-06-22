import React from "react";
import './SingleClientBtn.css';

const SingleClientBtn = ({ className, onClick, icon: Icon, label }) => {
  return (
    <button className={`client-button ${className}`} onClick={onClick}>
      {Icon && <span><Icon /></span>} {label}
    </button>
  );
};

export default SingleClientBtn;