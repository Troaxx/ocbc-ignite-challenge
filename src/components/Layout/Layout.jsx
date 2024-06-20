import React from "react";
import { Outlet} from "react-router";

import './Layout.css'

const Layout = () => {

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
  <main>
    <Outlet/>
  </main>
  </div>;
 </>
  ) 
};

export default Layout;
