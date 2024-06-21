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
      <p>{label}</p>
      <IconComponent className="operation-box-icon" />
    </div>
  );
};

export default OperationBox;
