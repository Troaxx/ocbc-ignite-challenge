import React, { createContext, useContext, useState, useEffect } from "react";

import dataService from "../services/dataService";

const FetchClientsContext = createContext();

export const FetchClientsProvider = ({ children }) => {

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientsData = await dataService.getClients();
      setClients(clientsData);
    } catch (error) {
      setError('Failed to fetch clients.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData) => {
    try {
      const newClient = await dataService.addClient(clientData);
      await fetchClients();
      return newClient;
    } catch (error) {
      throw error;
    }
  };

  const updateClient = async (clientId, updatedData) => {
    try {
      const updatedClient = await dataService.updateClient(clientId, updatedData);
      await fetchClients();
      return updatedClient;
    } catch (error) {
      throw error;
    }
  };

  const deleteClient = async (clientId) => {
    try {
      await dataService.deleteClient(clientId);
      await fetchClients();
    } catch (error) {
      throw error;
    }
  };

  const getClientById = async (clientId) => {
    try {
      return await dataService.getClientById(clientId);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);


  return (
    <FetchClientsContext.Provider value={{
      clients, 
      error, 
      loading, 
      fetchClients,
      addClient,
      updateClient,
      deleteClient,
      getClientById
    }}>
      {children}
    </FetchClientsContext.Provider>
  );
};

export const useFetchClients = () => useContext(FetchClientsContext);