import React from "react";

import ClientSearch from "../../ClientManage/ClientSearch/ClientSearch";
import { getPlaceholder } from "../../../utils/filters";

import './SearchByFilter.css'

const SearchByFilter = ({ filter, handleSearchChange, handleCheckboxChange }) => {

  return (
    <div className="search-container">
      <ClientSearch
        placeholder={getPlaceholder(filter)}
        handleSearchChange={handleSearchChange}
      />
      <div className="checkbox-container">

      <label htmlFor="cash-filter">Cash</label>
      <input
        type="checkbox"
        name="cash"
        id="cash-filter"
        checked={filter === "cash"}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="id-filter">ID</label>
      <input
        type="checkbox"
        name="id"
        id="id-filter"
        checked={filter === "id"}
        onChange={handleCheckboxChange}
      />
      </div>
    </div>
  );
};

export default SearchByFilter;
