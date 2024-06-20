import React from "react";

import './LoginPage.css'
import { SignInForm } from "../../components";


const LoginPage = () => {
  return (
    <>
      <div className="LoginPage">
        <div className="login-box-container">
          <div className="login-image"></div>
          <div className="login-form-container">
            <h1 className="login-title">LOGIN</h1>
            <SignInForm/>
          </div>
        </div>
      </div>
    </>
  )
};

export default LoginPage;
