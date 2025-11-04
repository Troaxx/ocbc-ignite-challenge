import React from "react";
import { Outlet} from "react-router";

import NavBar from "./NavBar/NavBar";
import './Layout.css'
const Layout = () => {

  return (
 <>
  <div className="Layout">
   <NavBar/>
  <main>
    <Outlet/>
  </main>
  </div>
 </>
  ) 
};

export default Layout;
