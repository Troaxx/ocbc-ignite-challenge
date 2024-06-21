import React from 'react';

import { useNavigate } from 'react-router-dom';

import './OperationBox.css';

const OperationBox = ({ label, IconComponent, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="operation-box" onClick={handleClick}>
      <IconComponent className="operation-box-icon" />
      <p>{label}</p>
    </div>
  );
};

export default OperationBox;
