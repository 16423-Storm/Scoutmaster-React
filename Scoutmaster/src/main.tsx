import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

import "./assets/scripts/localization.js";

import "./assets/styles/desktop.css";
import "./assets/styles/phones768.css";
import "./assets/styles/tablet1024.css";
import "./assets/styles/sharedstyles.css";
import "./assets/styles/misc/localization.css";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <App />
        </StrictMode>
    </BrowserRouter>,
);
