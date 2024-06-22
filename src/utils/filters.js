export const getPlaceholder = (filter) => {
  if (filter === "cash") {
    return "Search client by cash ...";
  } else if (filter === "id") {
    return "Search client by ID ...";
  }
};

export const filterClients = (clients, filter, searchTerm) => {
  if (!searchTerm) {
    return [];
  }
  if (filter === "cash") {
    return clients.filter(client => client.cash >= parseFloat(searchTerm || 0));
  } else if (filter === "id") {
    return clients.filter(client => client.id.toString().toLowerCase().includes(searchTerm.toLowerCase()));
  }
  return clients; 
};