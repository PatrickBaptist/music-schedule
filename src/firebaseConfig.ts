import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgHCu1LzT99svscYVMgwqhiRLATLxFgHg",
  authDomain: "louvor-manancial.firebaseapp.com",
  databaseURL: "https://louvor-manancial-default-rtdb.firebaseio.com/",
  projectId: "louvor-manancial",
  storageBucket: "louvor-manancial.appspot.com",
  messagingSenderId: "784323602460",
  appId: "1:784323602460:web:dd0c25a22c7e618b8497d9",
  measurementId: "G-FBZB57Z2V4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };