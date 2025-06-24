import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { AuthContextProvider } from "./store/auth-context";

// Set default base URL for axios
axios.defaults.baseURL =
  import.meta.env.VITE_BE_URL || "http://localhost:4000/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
