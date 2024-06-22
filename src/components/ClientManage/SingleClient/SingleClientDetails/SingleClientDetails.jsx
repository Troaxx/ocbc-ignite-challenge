import React from "react";

import './SingleClientDetails.css'

const SingleClientDetails = ({ client, editData, editMode, handleChange }) => {
  return (
    <div className="client-details-container">
      {editMode ? (
        <>
          <h3>Name: <input name="name" type="text" value={editData.name} onChange={handleChange} /></h3>
          <h3>ID number: <span>{client.id}</span></h3>
          <h3>Age: <input name="age" type="number" value={editData.age} onChange={handleChange} /></h3>
          <h3>Address: <input name="city" type="text" value={editData.city} onChange={handleChange} /></h3>
          <h3>Phone Number: <input name="phone" type="text" value={editData.phone} onChange={handleChange} /></h3>
          <h3>Cash: <span>{client.cash}</span></h3>
          <h3>Credit: <span>{client.credit}</span></h3>
        </>
      ) : (
        <>
          <h3>Name: <span>{client.name}</span></h3>
          <h3>ID number: <span>{client.id}</span></h3>
          <h3>Age: <span>{client.age}</span></h3>
          <h3>Address: <span>{client.city}</span></h3>
          <h3>Phone Number: <span>{client.phone}</span></h3>
          <h3>Cash: <span>{client.cash}</span></h3>
          <h3>Credit: <span>{client.credit}</span></h3>
        </>
      )}
    </div>
  );
};

export default SingleClientDetails;
