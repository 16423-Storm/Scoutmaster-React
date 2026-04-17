import { Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/landingpage";
import SignUpPage from "./assets/pages/signuppage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    );
}

export default App;
