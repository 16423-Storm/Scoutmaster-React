// Library Imports
import { useScreenType, useSignedIn } from "../scripts/multipageutils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Component Imports
import DashboardHome from "./subpages/dashboard/home";
import DashboardPrescout from "./subpages/dashboard/prescouting.tsx";
import DashboardMatchScouting from "./subpages/dashboard/matchscouting.tsx";
import DashboardSummary from "./subpages/dashboard/summary.js";

// Script Imports
import { languages } from "../scripts/localization.js";

// Icon Imports
import { FaHome, FaGamepad, FaNewspaper } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

function Dashboard() {
    const { t } = useTranslation();

    type Page = "home" | "prescouting" | "matchscouting" | "summary";

    const [currentPage, setCurrentPage] = useState<Page>("home");
    const [navbarVisible, setNavbarVisible] = useState(true);

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
        }
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-maincontainer">
                    {navbarVisible && (
                        <div className="desktop-dash-navbar">
                            <button
                                className={
                                    currentPage == "home"
                                        ? "desktop-dash-navbar-button-active"
                                        : "desktop-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("home")}
                                disabled={currentPage == "home"}
                            >
                                <FaHome />
                                {"\u00A0"}
                                {t("home")}
                            </button>
                            <button
                                className={
                                    currentPage == "prescouting"
                                        ? "desktop-dash-navbar-button-active"
                                        : "desktop-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("prescouting")}
                                disabled={currentPage == "prescouting"}
                            >
                                <FaMagnifyingGlass />
                                {"\u00A0"}
                                {t("prescout")}
                            </button>
                            <button
                                className={
                                    currentPage == "matchscouting"
                                        ? "desktop-dash-navbar-button-active"
                                        : "desktop-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("matchscouting")}
                                disabled={currentPage == "matchscouting"}
                            >
                                <FaGamepad />
                                {"\u00A0"}
                                {t("matchscout")}
                            </button>
                            <button
                                className={
                                    currentPage == "summary"
                                        ? "desktop-dash-navbar-button-active"
                                        : "desktop-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("summary")}
                                disabled={currentPage == "summary"}
                            >
                                <FaNewspaper />
                                {"\u00A0"}
                                {t("summary")}
                            </button>
                        </div>
                    )}
                    <div className="desktop-dash-dashcontainer">
                        {renderCurrentPage()}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-dash-maincontainer">
                    {navbarVisible && (
                        <div className="phone-dash-navbar">
                            <button
                                className={
                                    currentPage == "home"
                                        ? "phone-dash-navbar-button-active"
                                        : "phone-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("home")}
                                disabled={currentPage == "home"}
                            >
                                <FaHome />
                                {"\u00A0"}
                                {t("home")}
                            </button>
                            <button
                                className={
                                    currentPage == "prescouting"
                                        ? "phone-dash-navbar-button-active"
                                        : "phone-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("prescouting")}
                                disabled={currentPage == "prescouting"}
                            >
                                <FaMagnifyingGlass />
                                {"\u00A0"}
                                {t("prescout")}
                            </button>
                            <button
                                className={
                                    currentPage == "matchscouting"
                                        ? "phone-dash-navbar-button-active"
                                        : "phone-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("matchscouting")}
                                disabled={currentPage == "matchscouting"}
                            >
                                <FaGamepad />
                                {"\u00A0"}
                                {t("matchscout")}
                            </button>
                            <button
                                className={
                                    currentPage == "summary"
                                        ? "phone-dash-navbar-button-active"
                                        : "phone-dash-navbar-button"
                                }
                                onClick={() => setCurrentPage("summary")}
                                disabled={currentPage == "summary"}
                            >
                                <FaNewspaper />
                                {"\u00A0"}
                                {t("summary")}
                            </button>
                        </div>
                    )}
                    <div className="phone-dash-dashcontainer">
                        {renderCurrentPage()}
                    </div>
                </div>
            </>
        );
    }
}

export default Dashboard;
