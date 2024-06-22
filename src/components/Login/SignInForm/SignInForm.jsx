import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormInput from "../../FormInput/FormInput";
import { useAuth } from "../../../context/AuthContext";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import Loader from "../../Loader/Loader"

import { validateEmail } from "../../../utils/validations";

import './SignInForm.css';

const SignInForm = () => {

  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setEmailError('');
    
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      setIsLoading(false);
      setEmailError('Please enter a valid email address.');
      return;
    }
    try {
      const admin = await login(email, password);
      if(admin) {
        navigate('/'); 
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSignIn}>
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        <div className="login-button-container">
          <button className="sign-in-button button" type="submit">
            SIGN IN
          </button>
          <Link className="forget-link" to='https://github.com/DanielYehezkely/bank-management-react/blob/main/README.md'>Forgot your password?</Link>
        </div>
      </form>
      {isLoading && <Loader/>}
      {error && <ErrorComponent errorMessage={error.message}/>} 
    </>
  );
};

export default SignInForm;