import { db } from '../config/firebaseConfig'; 
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const CLIENTS_COLLECTION = 'clients';

export const getClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Error fetching clients');
  }
};

// Add a new client
export const addClient = async (clientData) => {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), clientData);
    return { id: docRef.id, ...clientData };
  } catch (error) {
    throw new Error('Error adding client');
  }
};

// Delete a client
export const deleteClient = async (clientId) => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
  } catch (error) {
    throw new Error('Error deleting client');
  }
};