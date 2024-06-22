import React from "react";

import ICONS from "../../../models/icons";

import './ClientSearch.css';

const ClientSearch = ({ handleSearchChange }) => {

  return (
    <>
      <form className="ClientSearch" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          id="search"
          placeholder="Search client by ID..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <button type="submit" id="submit">
          <ICONS.Search />
        </button>
      </form>
    </>
  );
};

export default ClientSearch;