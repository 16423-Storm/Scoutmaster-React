import { useTranslation } from "react-i18next";
import { useGoToPage } from "../scripts/multipageutils";

import SVG404 from "./../../assets/images/branding/404.svg?react";

function NotFound() {
    const { t } = useTranslation();

    const goHome = useGoToPage("/");

    return (
        <div className="error404-main">
            <SVG404 />
            <h1>{t("pagenotfound")}</h1>
            <p>{t("pagenotfounddesc")}</p>
            <button onClick={goHome}>{t("gobackhome")}</button>
        </div>
    );
}

export default NotFound;
