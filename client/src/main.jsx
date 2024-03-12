import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Pages/Routes/Routes.jsx";
import firebase from "firebase/compat/app";
import { firebaseConfig } from "./firebase/firebase.config.js";
import ContextProvider from "./Context/ContextProvider.jsx";

firebase.initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ContextProvider>
  </React.StrictMode>
);
