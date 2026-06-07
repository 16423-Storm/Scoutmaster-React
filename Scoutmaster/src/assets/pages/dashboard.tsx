// Library Imports
import { useScreenType, useSignedIn } from "../scripts/multipageutils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import DashboardHome from "./subpages/dashboard/home";
import DashboardPrescout from "./subpages/dashboard/prescouting.tsx";
import DashboardMatchScouting from "./subpages/dashboard/matchscouting.tsx";
import DashboardSummary from "./subpages/dashboard/summary.js";
import DashboardSettings from "./subpages/dashboard/settings.tsx";

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

    function renderCurrentPage() {
        switch (currentPage) {
            case "home":
                return <DashboardHome />;
            case "prescouting":
                return <DashboardPrescout />;
            case "matchscouting":
                return <DashboardMatchScouting />;
            case "summary":
                return <DashboardSummary />;
            case "settings":
                return <DashboardSettings />;
        }
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <p>desktop dash</p>
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-sidebar"></div>
                    <div className="desktop-dash-dashcontainer">
                        {renderCurrentPage()}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <p>phone or tablet dash</p>
            </>
        );
    }
}

export default dashboard;
