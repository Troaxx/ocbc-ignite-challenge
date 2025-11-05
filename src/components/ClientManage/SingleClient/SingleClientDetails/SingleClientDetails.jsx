import React from "react";

import './SingleClientDetails.css'

const SingleClientDetails = ({ client, editData, editMode, handleChange }) => {
  return (
    <div className="client-details-container">
      {editMode ? (
        <>
          <h3>
            <span className="label">Name</span>
            <input className="value-input" name="name" type="text" value={editData.name} onChange={handleChange} />
          </h3>
          <h3>
            <span className="label">ID number</span>
            <span className="value">{client.id}</span>
          </h3>
          <h3>
            <span className="label">Age</span>
            <input className="value-input" name="age" type="number" value={editData.age} onChange={handleChange} />
          </h3>
          <h3>
            <span className="label">Address</span>
            <input className="value-input" name="city" type="text" value={editData.city} onChange={handleChange} />
          </h3>
          <h3>
            <span className="label">Phone Number</span>
            <input className="value-input" name="phone" type="text" value={editData.phone} onChange={handleChange} />
          </h3>
          <h3>
            <span className="label">Cash</span>
            <span className="value">{client.cash}</span>
          </h3>
          <h3>
            <span className="label">Credit</span>
            <span className="value">{client.credit}</span>
          </h3>
        </>
      ) : (
        <>
          <h3>
            <span className="label">Name</span>
            <span className="value">{client.name}</span>
          </h3>
          <h3>
            <span className="label">ID number</span>
            <span className="value">{client.id}</span>
          </h3>
          <h3>
            <span className="label">Age</span>
            <span className="value">{client.age}</span>
          </h3>
          <h3>
            <span className="label">Address</span>
            <span className="value">{client.city}</span>
          </h3>
          <h3>
            <span className="label">Phone Number</span>
            <span className="value">{client.phone}</span>
          </h3>
          <h3>
            <span className="label">Cash</span>
            <span className="value">{client.cash}</span>
          </h3>
          <h3>
            <span className="label">Credit</span>
            <span className="value">{client.credit}</span>
          </h3>
        </>
      )}
    </div>
  );
};

export default SingleClientDetails;
