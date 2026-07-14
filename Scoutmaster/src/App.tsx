import { Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/landingpage";
import SignUpPage from "./assets/pages/signuppage";
import SignInPage from "./assets/pages/signinpage";
import Dashboard from "./assets/pages/dashboard";

import { useStartTheme } from "./assets/scripts/multipageutils";

function App() {
    useStartTheme();
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
