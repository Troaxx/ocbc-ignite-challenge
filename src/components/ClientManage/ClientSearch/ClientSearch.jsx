import React from "react";

import ICONS from "../../../models/icons";

import './ClientSearch.css'

const ClientSearch = () => {

  return (
    <>
      <form className="ClientSearch">
        <input type="text" id="search" placeholder="Search for..." required="" />
        <button type="submit" id="submit">
          <ICONS.Search />
        </button>
      </form>
    </>
  );

};

export default ClientSearch;
