import React from "react";
import { Outlet} from "react-router";

import NavBar from "./NavBar/NavBar";
import Footer from './Footer/Footer'
import './Layout.css'
const Layout = () => {

  return (
 <>
  <div className="Layout">
   <NavBar/>
  <main>
    <Outlet/>
  </main>
    <Footer/>
  </div>
 </>
  ) 
};

export default Layout;
