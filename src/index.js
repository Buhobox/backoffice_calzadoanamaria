import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import {
  FirebaseAppProvider,
} from "reactfire";
const firebaseConfig = {
  apiKey: "AIzaSyDfYlUZXP99suUSkJXHvDjY6bDu46THZdE",
  authDomain: "menta-8d3d9.firebaseapp.com",
  projectId: "menta-8d3d9",
  storageBucket: "menta-8d3d9.appspot.com",
  messagingSenderId: "384506274545",
  appId: "1:384506274545:web:6057f6f409bd36cec23f50",
};

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById("root")
);
