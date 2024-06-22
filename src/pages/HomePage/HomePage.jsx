import React from "react";

import ICONS from "../../models/icons";
import { OperationBox } from "../../components";

import './HomePage.css'

const HomePage = () => {
  return (

    <div className="HomePage">
      <div className="greet-container">
        <h1>Welcome Back Admin !</h1>
        <h2>its good to have you back ... </h2>
        <h3>Whats is the plan for today ?  </h3>
      </div>
      <div className="operations-container">
        <div className="operations-box-container">
          <OperationBox label="Manage Client" IconComponent={ICONS.Manage} navigateTo="/clientManage" />
          <OperationBox label="Add New Client" IconComponent={ICONS.AddClient} navigateTo="/addClient" />
          <OperationBox label="Remove Client" IconComponent={ICONS.RemoveClient} navigateTo="/clientManage" />
          <OperationBox label="Make Transfer" IconComponent={ICONS.Transfer} navigateTo="/transactions" />
          <OperationBox label="Make Deposit" IconComponent={ICONS.Deposit} navigateTo="/transactions" />
          <OperationBox label="Client Withdraw" IconComponent={ICONS.Draw} navigateTo="/transactions" />
        </div>
      </div>
    </div>

  );
};

export default HomePage;
