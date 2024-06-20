import React, { useEffect, useState } from 'react';

import { db, auth } from './config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import SignIn from './SignIn';

function App() {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    const fetchClients = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        console.log(querySnapshot.docs);
        const clientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched clients:", clientsList);
        setClients(clientsList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchClients();
  }, [user]);

  return (
    <div>
      <h1>Clients</h1>
      {user ? (
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              {client.name} - Age: {client.age}, City: {client.city}
            </li>
          ))}
        </ul>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default App;