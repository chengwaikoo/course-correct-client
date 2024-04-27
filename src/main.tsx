import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import HeightProvider from "./contexts/HeightProvider";
import UIProvider from "./contexts/UIProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeightProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </HeightProvider>
  </React.StrictMode>,
);
