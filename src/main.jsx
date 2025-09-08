import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // se você usa o CSS global aqui

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
