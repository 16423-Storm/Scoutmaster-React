// Library Imports
import {
    useScreenType,
    useSignedIn,
    useIsLightMode,
} from "../scripts/multipageutils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Component Imports
import DashboardHome from "./subpages/dashboard/home";
import DashboardPrescout from "./subpages/dashboard/prescouting.tsx";
import DashboardMatchScouting from "./subpages/dashboard/matchscouting.tsx";
import DashboardSummary from "./subpages/dashboard/summary.tsx";
import DashboardSettings from "./subpages/dashboard/settings.tsx";

// Script Imports
import { languages } from "../scripts/localization.js";

// Icon Imports
import { FaHome, FaGamepad, FaNewspaper, FaSun, FaMoon } from "react-icons/fa";
import { FaMagnifyingGlass, FaGear } from "react-icons/fa6";

import IconLogo from "../images/branding/iconlogo.svg?react";

function Dashboard() {
    const { t } = useTranslation();

    type Page =
        | "home"
        | "prescouting"
        | "matchscouting"
        | "summary"
        | "settings";

    const [currentPage, setCurrentPage] = useState<Page>("home");
    const [navbarVisible, setNavbarVisible] = useState(true);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
                {navbarVisible &&
                    (sidebarExpanded ? (
                        <div
                            className="desktop-dash-sidebar-expanded"
                            onMouseLeave={() => setSidebarExpanded(false)}
                        >
                            <div className="desktop-dash-sidebar-logocontainer">
                                <IconLogo className="desktop-dash-sidebar-logo" />
                            </div>
                            <div className="desktop-dash-sidebar-half">
                                <div
                                    className={
                                        currentPage == "home"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "home"
                                            ? () => setCurrentPage("home")
                                            : undefined
                                    }
                                >
                                    <FaHome />
                                    {""}
                                    Home
                                </div>
                                <div
                                    className={
                                        currentPage == "prescouting"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "prescouting"
                                            ? () =>
                                                  setCurrentPage("prescouting")
                                            : undefined
                                    }
                                >
                                    <FaMagnifyingGlass />
                                    {""}
                                    Prescouting
                                </div>
                                <div
                                    className={
                                        currentPage == "matchscouting"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "matchscouting"
                                            ? () =>
                                                  setCurrentPage(
                                                      "matchscouting",
                                                  )
                                            : undefined
                                    }
                                >
                                    <FaGamepad />
                                    {""}
                                    Match Scouting
                                </div>
                                <div
                                    className={
                                        currentPage == "summary"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "summary"
                                            ? () => setCurrentPage("summary")
                                            : undefined
                                    }
                                >
                                    <FaNewspaper />
                                    {""}
                                    Summary
                                </div>
                            </div>
                            <div className="desktop-dash-sidebar-bottomhalf">
                                <div
                                    className={
                                        currentPage == "settings"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "settings"
                                            ? () => setCurrentPage("settings")
                                            : undefined
                                    }
                                >
                                    <FaGear />
                                    {""}
                                    Settings
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="desktop-dash-sidebar"
                            onMouseEnter={() => setSidebarExpanded(true)}
                        >
                            <div className="desktop-dash-sidebar-logocontainer">
                                <IconLogo className="desktop-dash-sidebar-logo" />
                            </div>
                            <div className="desktop-dash-sidebar-half">
                                <div
                                    className={
                                        currentPage == "home"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    style={{ justifyContent: "center" }}
                                >
                                    <FaHome />
                                </div>
                                <div
                                    className={
                                        currentPage == "prescouting"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    style={{ justifyContent: "center" }}
                                >
                                    <FaMagnifyingGlass />
                                </div>
                                <div
                                    className={
                                        currentPage == "matchscouting"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    style={{ justifyContent: "center" }}
                                >
                                    <FaGamepad />
                                </div>
                                <div
                                    className={
                                        currentPage == "summary"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    style={{ justifyContent: "center" }}
                                >
                                    <FaNewspaper />
                                </div>
                            </div>
                            <div className="desktop-dash-sidebar-bottomhalf">
                                <div
                                    className={
                                        currentPage == "settings"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "settings"
                                            ? () => setCurrentPage("settings")
                                            : undefined
                                    }
                                >
                                    <FaGear />
                                </div>
                            </div>
                        </div>
                    ))}
                <div className="desktop-dash-maincontainer">
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
                    <div className="phone-dash-dashcontainer">
                        {renderCurrentPage()}
                    </div>
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
                                {""}
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
                                {""}
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
                </div>
            </>
        );
    }
}

export default Dashboard;
