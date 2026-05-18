// Library Imports
import { useScreenType, useSignedIn } from "../scripts/multipageutils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Script Imports
import { languages } from "../scripts/localization.js";

function dashboard() {
    const { t } = useTranslation();

    type Page = "home" | "settings" | "profile";
    const [currentPage, setCurrentPage] = useState<Page>("home");

    return <>dash</>;
}

export default dashboard;
