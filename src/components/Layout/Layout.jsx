import React, { useState } from "react";
import { Outlet, Navigate } from "react-router";

import './Layout.css'

const Layout = () => {

  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
 <>
  <div className="Layout">
  <nav className="nav-bar">
    <div className="logo">Bank Logo</div>
    <ul>
      <li>Home</li>
      <li>Add User</li>
      <li></li>
    </ul>
  </nav>
    <Outlet/>
  </div>;
 </>
  ) 
};

export default Layout;
