import React, { useEffect, useState } from "react";

import { getClients } from "../../services/firebaseApi";
import ClientCard from "../../components/ClientManage/ClientCard/ClientCard";
import { ClientSearch } from "../../components";

import './ClientManagePage.css'; 

const ClientManagePage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      setError('Failed to fetch clients.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="ClientManagePage">
      <ClientSearch/>
      <section className="clients-list-container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {clients.length > 0 ? (
          clients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          !loading && <p>No clients found.</p>
        )}
      </section>
    </div>
  );
};

export default ClientManagePage;