import { db, storage } from '../config/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

const CLIENTS_COLLECTION = 'clients';

export const uploadImage = async (file) => {
  if (!file) throw new Error("No file provided");

  try {
    const storageRef = ref(storage, `clients/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image: " + error.message);
  }
};

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

export const addClient = async (clientId, clientData) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      throw new Error('Client ID already exists. Please choose a different ID.');
    }
    await setDoc(docRef, clientData);
    return { id: clientId, ...clientData };
  } catch (error) {
    throw new Error('Error adding client: ' + error.message);
  }
};

export const deleteClient = async (clientId) => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
  } catch (error) {
    throw new Error('Error deleting client');
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    console.log('Updating client with ID:', clientId, 'with data:', updatedData);
    await updateDoc(docRef, updatedData);
    return { id: clientId, ...updatedData };
  } catch (error) {
    console.error('Error updating client:', error);
    throw new Error('Error updating client');
  }
};