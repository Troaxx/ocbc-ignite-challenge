import React from "react";

import ICONS from "../../../models/icons";

import './ClientActionCard.css';

const ClientActionCard = ({ client, onDeposit, onDraw, onTransfer, onChangeCredit }) => {
  return (
    <div className={`ClientActionCard ${client.isActive ? '' : 'inactive'}`} key={client.id}>
      <h3>{client.name}</h3>
      <h4>ID: {client.id}</h4>
      <p className="client-detail">Cash: {client.cash}</p>
      <p className="client-detail">Credit: {client.credit}</p>
      <button className={`button action-button ${client.isActive ? '' : 'disabled'} `} onClick={() => onDeposit()} disabled={!client.isActive}>Deposit <ICONS.Deposit /></button>
      <button className={`button action-button ${client.isActive ? '' : 'disabled'} `} onClick={() => onDraw()} disabled={!client.isActive}>Withdraw <ICONS.Draw /></button>
      <button className={`button action-button ${client.isActive ? '' : 'disabled'} `} onClick={() => onTransfer()} disabled={!client.isActive}>Transfer <ICONS.Transfer /></button>
      <button className={`button action-button ${client.isActive ? '' : 'disabled'} `} onClick={onChangeCredit} disabled={!client.isActive}>Change Credit <ICONS.Change/> </button>
      <p className={client.isActive ? 'client-active' : 'client-not-active'}>{client.isActive ? 'Active' : 'Not Active'}</p>
    </div>
  );
};

export default ClientActionCard;
