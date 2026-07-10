import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

import "./assets/scripts/localization.js";

import "./assets/styles/desktop/index.css";
import "./assets/styles/phone768/index.css";
import "./assets/styles/tablet1024/index.css";
import "./assets/styles/misc/index.css";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <App />
        </StrictMode>
    </BrowserRouter>,
);
