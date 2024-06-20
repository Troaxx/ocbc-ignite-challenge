import { db } from '../config/firebaseConfig'; 
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

const CLIENTS_COLLECTION = 'clients';

export const getClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Error fetching clients');
  }
};

export const getClientById = async (clientId) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    throw new Error('Error fetching client');
  }
};

export const addClient = async (clientData) => {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), clientData);
    return { id: docRef.id, ...clientData };
  } catch (error) {
    throw new Error('Error adding client');
  }
};

export const deleteClient = async (clientId) => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
  } catch (error) {
    throw new Error('Error deleting client');
  }
};