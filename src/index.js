import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import {
  FirebaseAppProvider,
} from "reactfire";
const firebaseConfig = {
  apiKey: "AIzaSyDSQf3q8JMMa2UcrymsseuMPaVknhZ_ahg",
  authDomain: "santandereana-6d1fd.firebaseapp.com",
  projectId: "santandereana-6d1fd",
  storageBucket: "santandereana-6d1fd.appspot.com",
  messagingSenderId: "989521974661",
  appId: "1:989521974661:web:5de63284915a9b615460ec",
  measurementId: "G-64V8ZFPJEX"
}

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById("root")
);
