import React from "react";

import ICONS from "../../../models/icons";

import './ClientCard.css';

const ClientCard = ({ client, onManage }) => {

  return (
    <div className={`client-card ${client.isActive ? '' : 'inactive'} `} key={client.id}>
      <div className="client-info">
        <div className="client-name">{client.name}</div>
        <div className="client-meta">
          <span className="meta-item"><strong>ID:</strong> {client.id}</span>
          <span className="meta-item"><strong>Age:</strong> {client.age}</span>
          <span className="meta-item"><strong>Phone:</strong> {client.phone}</span>
          <span className="meta-item"><strong>City:</strong> {client.city}</span>
        </div>
      </div>
      <div className="client-actions">
        <button className="button manage-button" onClick={()=> onManage(client.id)} aria-label={`Manage ${client.name}`}>
          <ICONS.Settings/> Manage
        </button>
        <div className={client.isActive ? 'client-active badge' : 'client-not-active badge'}>
          {client.isActive ? 'Active' : 'Not Active'}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;