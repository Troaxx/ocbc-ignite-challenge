import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebaseConfig";
import { signInWithEmailAndPassword } from 'firebase/auth';
import FormInput from "../../FormInput/FormInput";
import './SignInForm.css';

const SignInForm = () => {
  const navigate = useNavigate(); // Navigation hook from react-router-dom

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save or remove credentials based on the "Remember Me" checkbox
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      console.log("Signed in successfully");
      navigate('/'); // Navigate to the home page after successful login
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
      <div className="input-group checkbox">
        <input
          type="checkbox"
          id="remember-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember-me">Remember my password</label>
      </div>
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

