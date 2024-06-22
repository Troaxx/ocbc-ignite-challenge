import React from "react";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import ICONS from "../../../models/icons";

import './Footer.css';

const Footer = () => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('kegezgaming@gmail.com');
      toast.success('Email copied to clipboard!', {
        className: 'custom-toast-position',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error('Failed to copy email.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="Footer">
      <div className="footer-logo">
        <img src="/assets/svg/logo-no-background.svg" alt="footer-logo" />
      </div>
      <div className="copyrights">
        &copy; 2024 Daniel Yehezkely. All rights reserved.
        <a href="/terms-of-service">Terms of Service</a> | <a href="/privacy-policy">Privacy Policy</a>
      </div>
      <div className="footer-social-links">
        <a href='https://github.com/DanielYehezkely/bank-management-react' target="_blank" rel="github-link" >
          <ICONS.GitHub className="icon-link github-link" />
        </a>
        <a href='https://www.linkedin.com/in/daniel-yehezkely/' target="_blank" rel="linkedin-link" >
          <ICONS.LinkedIn className="icon-link linked-in-link" />
        </a>
        <span onClick={handleCopy}>
          <ICONS.Gmail className="icon-link email-link" />
        </span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Footer;