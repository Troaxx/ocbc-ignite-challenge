import React from "react";

import './LoginPage.css'
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      <div className="LoginPage">
        <div className="login-box-container">
          <div className="login-image"></div>
          <div className="login-form-container">
            <h1 className="login-title">LOGIN</h1>
            <form className="login-form" >
                <div className="input-group">
                  <label htmlFor="">Username</label>
                  <input type="text" />
                </div>
                <div className="input-group">
                  <label htmlFor="">Password</label>
                  <input type="password" />
                </div>
                <div className="input-group checkbox">
                  <input type="checkbox" />
                  <label htmlFor="">Remember my password</label>
                </div>
                <div className="button-container">
                <button className="sign-in-button">
                  SIGN IN
                </button>
                <Link className="forget-link" to={'https://github.com/DanielYehezkely/bank-management-react'} >forgot you password ? </Link>
                </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
};

export default LoginPage;
