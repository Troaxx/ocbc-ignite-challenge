import React from "react";

import './ErrorComponent.css'

const ErrorComponent = ({errorMessage}) => {
  return <div className="ErrorComponent" >{errorMessage}</div>;
};

export default ErrorComponent;
