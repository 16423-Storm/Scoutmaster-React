import { Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/landingpage";
import SignUpPage from "./assets/pages/signuppage";
import SignInPage from "./assets/pages/signinpage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
        </Routes>
    );
}

export default App;
