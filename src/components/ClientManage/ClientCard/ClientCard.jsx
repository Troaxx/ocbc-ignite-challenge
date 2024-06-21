import React from "react";
import './ClientCard.css';

const ClientCard = ({ client }) => {
  return (
    <div className="client-card" key={client.id}>
      <h3>{client.name} </h3>
      <h4>ID : {client.id} |</h4>
      <p>Age: {client.age} |</p>
      <p>Phone: {client.phone} |</p>
      <p>Address: {client.city} |</p>
    </div>
  );
};

export default ClientCard;