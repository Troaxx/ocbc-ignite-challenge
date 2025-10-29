import { clients } from './mockData';

const mockApi = {
  getClients: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(clients);
      }, 500);
    });
  },
  getClientById: (clientId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          resolve(client);
        } else {
          reject(new Error('Client not found'));
        }
      }, 500);
    });
  },
  addClient: (clientId, clientData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClient = { id: clientId, ...clientData };
        clients.push(newClient);
        resolve(newClient);
      }, 500);
    });
  },
  deleteClient: (clientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          clients.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },
  updateClient: (clientId, updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          clients[index] = { ...clients[index], ...updatedData };
          resolve(clients[index]);
        }
      }, 500);
    });
  }
};

export default mockApi;
