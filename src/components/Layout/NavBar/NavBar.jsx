import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import ICONS from "../../../models/icons";
import { useAuth } from "../../../context/AuthContext";

import './NavBar.css'

const NavBar = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  const {logout} = useAuth();

  const handleScroll = () => {
    const navBar = document.querySelector('.nav-bar');
    if (window.scrollY > 0) {
      navBar.classList.add('sticky');
    } else {
      navBar.classList.remove('sticky');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogOutClick = async () => {
    logout();
  }

  const handleLogoClick = () => {
    navigate('/');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  }

  return (
    <nav className="nav-bar">
      <div className="logo-container">
        <img className="logo" src="/assets/images/dy-bank-high-resolution-logo-black-transparent.png" alt="" onClick={handleLogoClick} />
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <ICONS.CloseX /> : <ICONS.Bars />}
      </div>
      <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <li><NavLink className='nav-link' to={'/'}><ICONS.Home className="home-icon" /></NavLink></li>
        <li><NavLink className='nav-link' to={'/clientManage'}> Client Manage </NavLink></li>
        <li><NavLink className='nav-link' to={'/transactions'}> Transactions </NavLink></li>
        {isMenuOpen && <button className="logout-button button" onClick={handleLogOutClick}> LOGOUT <ICONS.Logout className="logout-icon" /></button>}
      </ul>
      <div className="logout-button-container">
        <button className="logout-button button" onClick={handleLogOutClick}> LOGOUT <ICONS.Logout className="logout-icon" /></button>
      </div>
    </nav>
  );
};

export default NavBar;
