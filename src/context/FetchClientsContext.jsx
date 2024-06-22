import React, { createContext, useContext, useState, useEffect } from "react";

import { getClients } from "../services/firebaseApi";

const FetchClientsContext = createContext();

export const FetchClientsProvider = ({ children }) => {

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
    <FetchClientsContext.Provider value={{clients, error, loading, fetchClients }}>
      {children}
    </FetchClientsContext.Provider>
  );
};

export const useFetchClients = () => useContext(FetchClientsContext);