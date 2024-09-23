import { db } from '../config/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

import {ADD_CLIENT_ERROR_MSG , DELETE_CLIENT_ERROR_MSG, GET_CLIENTS_ERROR_MSG, UPDATE_CLIENT_ERROR_MSG, ADD_EXISTING_CLIENT_ID_MSG , CLIENTS_COLLECTION} from '../models/constants'

export const getClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(GET_CLIENTS_ERROR_MSG);
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
      throw new Error(ADD_EXISTING_CLIENT_ID_MSG);
    }
    await setDoc(docRef, clientData);
    return { id: clientId, ...clientData };
  } catch (error) {
    throw new Error(ADD_CLIENT_ERROR_MSG + error.message);
  }
};

export const deleteClient = async (clientId) => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
  } catch (error) {
    throw new Error(DELETE_CLIENT_ERROR_MSG);
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    await updateDoc(docRef, updatedData);
    return { id: clientId, ...updatedData };
  } catch (error) {
    throw new Error(UPDATE_CLIENT_ERROR_MSG);
  }
};