import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../FormInput/FormInput";
import './SignInForm.css';
import { useAuth } from "../../../context/AuthContext";

const SignInForm = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error("Error signing in: ", error.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSignIn}>
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="email-input"
      />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="password-input"
      />
      <div className="button-container">
        <button className="sign-in-button" type="submit">
          SIGN IN
        </button>
        <Link className="forget-link" to="/forgot-password">Forgot your password?</Link>
      </div>
    </form>
  );
};

export default SignInForm;

