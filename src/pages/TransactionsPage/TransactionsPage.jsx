import React, { useState, useEffect } from "react";
import { ClientActionCard, ErrorComponent, Loader, SearchByFilter, ClientActionModal } from "../../components";
import { useFetchClients } from "../../context/FetchClientsContext";
import { filterClients } from '../../utils/filters';
import { updateClient } from '../../services/firebaseApi';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const [filter, setFilter] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error, fetchClients } = useFetchClients();
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionError, setActionError] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setFilter(name);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const result = filterClients(clients, filter, searchTerm);
    setFilteredClients(result);
  }, [searchTerm, filter, clients]);

  const handleAction = (client, action) => {
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
      let updatedData = {};

      if (actionType === "credit") {
        updatedData = { credit: newValue };
      } else if (actionType === "draw") {
        const drawAmount = newValue;
        let remainingDraw = drawAmount;
        let updatedCash = selectedClient.cash;
        let updatedCredit = selectedClient.credit;

        if (remainingDraw <= updatedCash) {
          updatedCash -= remainingDraw;
          remainingDraw = 0;
        } else {
          remainingDraw -= updatedCash;
          updatedCash = 0;
        }

        if (remainingDraw > 0) {
          if (remainingDraw <= updatedCredit) {
            updatedCredit -= remainingDraw;
          } else {
            setActionError('You cannot draw more than available cash and credit.');
            return;
          }
        }
        updatedData = { cash: updatedCash, credit: updatedCredit };
      } else if (actionType === "deposit") {
        updatedData = { cash: selectedClient.cash + newValue };
      } else if (actionType === "transfer") {
        const transferAmount = newValue;
        let remainingTransfer = transferAmount;
        let updatedCash = selectedClient.cash;

        if (remainingTransfer <= updatedCash) {
          updatedCash -= remainingTransfer;
        } else {
          setActionError('You cannot transfer more than available cash.');
          return;
        }

        const targetClient = clients.find(c => c.id === targetClientId);
        if (targetClient) {
          const targetUpdatedCash = (parseFloat(targetClient.cash) || 0) + remainingTransfer;

          await updateClient(targetClientId, { cash: targetUpdatedCash });
        } else {
          setActionError('Target client not found.');
          return;
        }

        updatedData = { cash: updatedCash };
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
              onChangeCredit={() => handleAction(client, "credit")}
              onDraw={() => handleAction(client, "draw")}
              onDeposit={() => handleAction(client, "deposit")}
              onTransfer={() => handleAction(client, "transfer")} // Add transfer action
            />
          ))
        )}
      </div>
      {actionError && <ErrorComponent errorMessage={actionError} />}
      {isModalOpen && selectedClient && (
        <ClientActionModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAction}
          loading={loading}
          actionType={actionType}
          currentLabel={
            actionType === "draw" ? "Available Cash"
              : actionType === "deposit" ? "Current Cash"
                : actionType === "transfer" ? "Current Cash"
                  : "Current Credit"
          }
          inputLabel={
            actionType === "draw" ? "Amount to Draw"
              : actionType === "deposit" ? "Amount to Deposit"
                : actionType === "transfer" ? "Amount to Transfer"
                  : "New Credit"
          }
          buttonLabel={
            actionType === "draw" ? "Draw Amount"
              : actionType === "deposit" ? "Deposit Amount"
                : actionType === "transfer" ? "Transfer Amount"
                  : "Update Credit"
          }
          clients={clients} // Pass clients for transfer target selection
        />
      )}
    </div>
  );
};

export default TransactionsPage;

