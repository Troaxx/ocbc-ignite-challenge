import React from "react";

import Loader from "../../Loader/Loader";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";
import ClientActionCard from "../ClientActionCard/ClientActionCard";
import { useFetchClients } from "../../../context/FetchClientsContext";

const ClientsList = ({ filteredClients, handleActionClick, searchTerm }) => {

  const { loading, error } = useFetchClients();

  return (
    <div className="clients-list-container">
      {loading && <Loader />}
      {error && <ErrorComponent errorMessage={error} />}
      {!loading && !searchTerm && (
        <p className="no-clients-message">Start typing to search for clients...</p>
      )}
      {!loading && searchTerm && filteredClients.length === 0 && (
        <p className="no-clients-message">No clients found.</p>
      )}
      {!loading && searchTerm && filteredClients.length > 0 && (
        filteredClients.map(client => (
          <ClientActionCard
            key={client.id}
            client={client}
            onChangeCredit={() => handleActionClick(client, "credit")}
            onDraw={() => handleActionClick(client, "draw")}
            onDeposit={() => handleActionClick(client, "deposit")}
            onTransfer={() => handleActionClick(client, "transfer")}
          />
        ))
      )}
    </div>
  );
};

export default ClientsList;
