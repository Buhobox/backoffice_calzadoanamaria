import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import {
  FirebaseAppProvider,
} from "reactfire";
const firebaseConfig = {
  apiKey: "AIzaSyAG0iagA400uFuk90KLAa0Uc77nWHoJPaU",
  authDomain: "websitecalzadoana.firebaseapp.com",
  projectId: "websitecalzadoana",
  storageBucket: "websitecalzadoana.appspot.com",
  messagingSenderId: "760365724158",
  appId: "1:760365724158:web:c1918f6051b211916950af"
}

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById("root")
);
