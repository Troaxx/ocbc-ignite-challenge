import React, { useState } from "react";
import { useNavigate } from "react-router";

import ClientCard from "../../components/ClientManage/ClientCard/ClientCard";
import { ClientSearch, ErrorComponent, Loader } from "../../components";
import { useFetchClients } from "../../context/FetchClientsContext";

import './ClientManagePage.css';

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

  const filteredClients = clients.filter(client =>
    client.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ClientManagePage">
      <ClientSearch handleSearchChange={handleSearchChange} />
      <section className={`clients-list-container ${loading ? 'align' : ''}`}>
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