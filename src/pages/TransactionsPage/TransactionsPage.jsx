import React, { useState, useEffect } from "react";

import { updateClient } from '../../services/firebaseApi';
import { ErrorComponent, SearchByFilter, ClientActionModal, ClientsList } from "../../components";
import { useFetchClients } from "../../context/FetchClientsContext";
import { filterClients } from '../../utils/filters';
import { getLabels } from "../../utils/labelHelpers";
import { getActionHandler } from "../../utils/handleClientActions"; 

import './TransactionsPage.css';

const TransactionsPage = () => {
  
  const [filter, setFilter] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionError, setActionError] = useState(null);
  const { clients, fetchClients } = useFetchClients();
  const { currentLabel, inputLabel, buttonLabel } = getLabels(actionType);

  useEffect(() => {
    const result = filterClients(clients, filter, searchTerm);
    setFilteredClients(result);
  }, [searchTerm, filter, clients]);

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setFilter(name);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleActionClick = (client, action) => {
    setSelectedClient(client);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setActionError(null);
  };

  const handleSubmitAction = async (clientId, newValue, targetClientId) => {
    setActionError(null);

    try {
      const handler = getActionHandler(actionType);
      if (!handler) {
        throw new Error('Unknown action type');
      }

      const updatedData = handler instanceof Function && handler.length === 5
        ? await handler(newValue, selectedClient, targetClientId, clients, updateClient)
        : handler(newValue, selectedClient);

      if (updatedData.error) {
        setActionError(updatedData.error);
        return;
      }

      await updateClient(clientId, updatedData);
      await fetchClients();
      handleCloseModal();
    } catch (error) {
      setActionError(error.message);
    }
  };

  return (
    <div className="TransactionsPage">
      <SearchByFilter
        filter={filter}
        handleSearchChange={handleSearchChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      <ClientsList
        filteredClients={filteredClients}
        handleActionClick={handleActionClick}
        searchTerm={searchTerm}
      />
      {actionError && <ErrorComponent errorMessage={actionError} />}
      {isModalOpen && selectedClient && (
        <ClientActionModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAction}
          actionType={actionType}
          currentLabel={currentLabel}
          inputLabel={inputLabel}
          buttonLabel={buttonLabel}
          clients={clients}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
