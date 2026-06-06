// Library Imports
import { useScreenType, useSignedIn } from "../scripts/multipageutils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import dashboardHome from "./subpages/dashboard/home.tsx";
import dashboardPrescout from "./subpages/dashboard/prescouting.tsx";
import dashboardMatchScouting from "./subpages/dashboard/matchscouting.tsx";
import dashboardSummary from "./subpages/dashboard/summary.js";
import dashboardSettings from "./subpages/dashboard/settings.tsx";

// Script Imports
import { languages } from "../scripts/localization.js";

function dashboard() {
    const { t } = useTranslation();

    type Page =
        | "home"
        | "prescouting"
        | "matchscouting"
        | "summary"
        | "settings";
    const [currentPage, setCurrentPage] = useState<Page>("home");

    return <>dash</>;
}

export default dashboard;
