import React from "react";

import ICONS from "../../../models/icons";

import './ClientCard.css';

const ClientCard = ({ client, onManage }) => {

  return (
    <div className={`client-card ${client.isActive ? '' : 'inactive'} `} key={client.id}>
      <h3>{client.name} </h3>
      <h4>ID : {client.id} |</h4>
      <p className="client-detail">Age: {client.age} |</p>
      <p className="client-detail">Phone: {client.phone} |</p>
      <p className="client-detail">Address: {client.city} |</p>
      <button className="button manage-button" onClick={()=> onManage(client.id)} >manage <ICONS.Settings/></button>
      <p className={client.isActive ? 'client-active' : 'client-not-active'}>{client.isActive ? 'Active' : 'Not Active'} </p>
    </div>
  );
};

export default ClientCard;