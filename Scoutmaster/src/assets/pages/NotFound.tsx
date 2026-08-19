import { useTranslation } from "react-i18next";
import { useScreenType } from "../scripts/multipageutils.js";

import SVG404 from "./../../assets/images/branding/404.svg?react";

function NotFound() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    return (
        <div className="error404-main">
            <SVG404 />
            <h1>Page Not Found</h1>
            <p>
                The page you are looking for is not available or does not exist.
            </p>
            <button>Go back to home</button>
        </div>
    );
}

export default NotFound;
