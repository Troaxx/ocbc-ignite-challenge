import initialData from '../data/database.json';

const STORAGE_KEY = 'ocbc_clients_database';

const dataService = {
  initializeDatabase: () => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData.clients));
      console.log('Database initialized with default data');
    }
  },

  resetDatabase: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData.clients));
    console.log('Database reset to default data');
    return initialData.clients;
  },

  exportDatabase: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const clients = data ? JSON.parse(data) : initialData.clients;
    console.log('Current database:', clients);
    return clients;
  },

  getClients: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const clients = data ? JSON.parse(data) : initialData.clients;
        resolve(clients);
      }, 300);
    });
  },

  getClientById: (clientId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const clients = data ? JSON.parse(data) : initialData.clients;
        const client = clients.find(c => c.id === clientId);
        if (client) {
          resolve(client);
        } else {
          reject(new Error('Client not found'));
        }
      }, 300);
    });
  },

  addClient: (clientData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const clients = data ? JSON.parse(data) : initialData.clients;
        
        const existingClient = clients.find(c => c.id === clientData.id);
        if (existingClient) {
          reject(new Error('Client with this ID already exists'));
          return;
        }

        const newClient = {
          id: clientData.id,
          name: clientData.name,
          age: parseInt(clientData.age) || 0,
          city: clientData.city,
          phone: clientData.phone,
          cash: parseFloat(clientData.cash) || 0,
          credit: parseFloat(clientData.credit) || 0,
          isActive: clientData.isActive !== undefined ? clientData.isActive : true,
          image: clientData.image || ''
        };
        
        clients.push(newClient);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        console.log('Client added to database:', newClient);
        resolve(newClient);
      }, 300);
    });
  },

  updateClient: (clientId, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const clients = data ? JSON.parse(data) : initialData.clients;
        
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          const normalizedData = { ...updatedData };
          
          if (normalizedData.age !== undefined) {
            normalizedData.age = parseInt(normalizedData.age) || 0;
          }
          if (normalizedData.cash !== undefined) {
            normalizedData.cash = parseFloat(normalizedData.cash) || 0;
          }
          if (normalizedData.credit !== undefined) {
            normalizedData.credit = parseFloat(normalizedData.credit) || 0;
          }
          
          clients[index] = { ...clients[index], ...normalizedData };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
          console.log('Client updated in database:', clients[index]);
          resolve(clients[index]);
        } else {
          reject(new Error('Client not found'));
        }
      }, 300);
    });
  },

  deleteClient: (clientId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const clients = data ? JSON.parse(data) : initialData.clients;
        
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
          const deletedClient = clients[index];
          clients.splice(index, 1);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
          console.log('Client deleted from database:', deletedClient);
          resolve();
        } else {
          reject(new Error('Client not found'));
        }
      }, 300);
    });
  }
};

dataService.initializeDatabase();

window.dataService = dataService;

export default dataService;

