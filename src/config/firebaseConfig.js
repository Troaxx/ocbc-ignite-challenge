import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBF7WpuCnWN1B0tNIp8CGIpn3Q96iXyl98",
  authDomain: "bankmanagementapi.firebaseapp.com",
  projectId: "bankmanagementapi",
  storageBucket: "bankmanagementapi.appspot.com",
  messagingSenderId: "805092074245",
  appId: "1:805092074245:web:50c504c5ba16f39e694d6c",
  measurementId: "G-44HY9R1HHR"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);


export { db, auth, analytics };
