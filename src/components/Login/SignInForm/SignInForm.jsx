import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormInput from "../../FormInput/FormInput";
import { useAuth } from "../../../context/AuthContext";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import Loader from "../../Loader/Loader";

import { validateEmail } from "../../../utils/validations";

import "./SignInForm.css";

// Read admin credentials from .env (Vite-style)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const SignInForm = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setLoginError("");

    // 1️⃣ Email format validation
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      setIsLoading(false);
      setEmailError("Please enter a valid email address.");
      return;
    }

    // 2️⃣ Credential check using .env values
    const isValidCredentials =
      email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (!isValidCredentials) {
      setIsLoading(false);
      setLoginError("Invalid email or password");
      return; // stay on /login
    }

    // 3️⃣ Call AuthContext login only if credentials are valid
    try {
      await login(email, password);
      // Navigate after login - localStorage is already set, ProtectedRoute will check it
      navigate("/", { replace: true }); // success → dashboard
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSignIn}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
          placeholder="you@company.com"
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
          placeholder="Enter your password"
        />
        {loginError && <p className="error-message">{loginError}</p>}

        <div className="login-button-container">
          <button
            aria-label="Sign in"
            className="sign-in-button button"
            type="submit"
          >
            SIGN IN
          </button>
          <Link
            className="forget-link"
            to="https://github.com/DanielYehezkely/bank-management-react/blob/main/README.md"
          >
            Forgot your password?
          </Link>
        </div>
      </form>

      {isLoading && <Loader />}
      {error && <ErrorComponent errorMessage={error.message} />}
    </>
  );
};

export default SignInForm;
