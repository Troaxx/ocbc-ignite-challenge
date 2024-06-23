import React, { useState } from "react";
import { useNavigate } from "react-router";

import ClientCard from "../../components/ClientManage/ClientCard/ClientCard";
import { ClientSearch, ErrorComponent, Loader } from "../../components";
import { useFetchClients } from "../../context/FetchClientsContext";

import './ClientManagePage.css';
import ICONS from "../../models/icons";

const ClientManagePage = () => {

  const { loading, clients, error } = useFetchClients();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const onManageClick = (clientId) => {
    navigate(`/singlePage/${clientId}`)
  }

  const onAddClick = ()=>{
    navigate('/addClient');
  }

  const filteredClients = clients.filter(client =>
    client.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ClientManagePage">
    <div className="search-container">
      <ClientSearch handleSearchChange={handleSearchChange} placeholder={"Search client by ID..."}/>
        <button className="add-icon-button" onClick={onAddClick}><ICONS.AddClient/></button>
    </div>
      <section className={`clients-list-container ${loading ? 'align-loader' : ''}`}>
        {loading && <Loader />}
        {error && <ErrorComponent />}
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <ClientCard key={client.id} client={client} onManage={onManageClick}  />
          ))
        ) : (
          !loading && <p className="no-clients-message">No clients found.</p>
        )}
      </section>
    </div>
  );
};

export default ClientManagePage;