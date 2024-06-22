import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import ICONS from "../../../models/icons";
import { useAuth } from "../../../context/AuthContext";

import './NavBar.css'

const NavBar = () => {
  
  const navigate = useNavigate()
  const {logout} = useAuth();
  
  const handleLogOutClick = async () => {
    logout();
  }

  const handleLogoClick = () => {
    navigate('/');
  }

  return (

    <nav className="nav-bar">
      <div className="logo-container">
        <img className="logo" src="/assets/images/dy-bank-high-resolution-logo-black-transparent.png" alt="" onClick={handleLogoClick} />
      </div>
      <ul className="nav-links">
        <li><NavLink className='nav-link' to={'/'}><ICONS.Home className="home-icon"/></NavLink></li>
        <li><NavLink className='nav-link' to={'/clientManage'}> Client Manage </NavLink></li>
        <li><NavLink className='nav-link' to={'/transactions'}> Transactions </NavLink></li>
      </ul>
      <div className="logout-button-container">
        <button className="logout-button button " onClick={handleLogOutClick}> LOGOUT <ICONS.Logout className="logout-icon"/></button>
      </div>
    </nav>

  );
};

export default NavBar;
