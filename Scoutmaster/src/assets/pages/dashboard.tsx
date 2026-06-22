// Library Imports
import {
    useScreenType,
    useSignedIn,
    useIsLightMode,
} from "../scripts/multipageutils";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Component Imports
import DashboardHome from "./subpages/dashboard/home";
import DashboardPrescout from "./subpages/dashboard/prescouting.tsx";
import DashboardMatchScouting from "./subpages/dashboard/matchscouting.tsx";
import DashboardSummary from "./subpages/dashboard/summary.tsx";
import DashboardSettings from "./subpages/dashboard/settings.tsx";
import DashboardCompetition from "./subpages/dashboard/competition.tsx";
import Blocker499 from "./components/blocker.tsx";

// Script Imports
import { languages } from "../scripts/localization.js";
import { dashboardStart } from "../scripts/localstorageutils.ts";

// Icon Imports
import { FaHome, FaGamepad, FaNewspaper, FaMedal } from "react-icons/fa";
import { FaMagnifyingGlass, FaGear } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineCancel } from "react-icons/md";

import IconLogo from "../images/branding/iconlogo.svg?react";

function Dashboard() {
    const { t } = useTranslation();

    type Page =
        | "home"
        | "prescouting"
        | "matchscouting"
        | "summary"
        | "competition"
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
            case "competition":
                return <DashboardCompetition />;
            case "settings":
                return <DashboardSettings />;
        }
    }

    const sidebarRef = useRef<HTMLDivElement | null>(null);

    var screenType = useScreenType();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(target) &&
                screenType != "desktop"
            ) {
                setSidebarExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        dashboardStart();
    }, []);

    if (screenType == "desktop") {
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
                                    {t("home")}
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
                                    {t("prescouting")}
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
                                    {t("matchscouting")}
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
                                    {t("summary")}
                                </div>
                                <div
                                    className={
                                        currentPage == "competition"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    onClick={
                                        currentPage !== "competition"
                                            ? () =>
                                                  setCurrentPage("competition")
                                            : undefined
                                    }
                                >
                                    <FaMedal />
                                    {""}
                                    {t("competition")}
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
                                    {t("settings")}
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
                                <div
                                    className={
                                        currentPage == "competition"
                                            ? "desktop-dash-sidebar-mainbutton-active"
                                            : "desktop-dash-sidebar-mainbutton"
                                    }
                                    style={{ justifyContent: "center" }}
                                >
                                    <FaMedal />
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
                {navbarVisible && (
                    <>
                        {sidebarExpanded && <Blocker499 />}
                        <div
                            className={
                                sidebarExpanded
                                    ? "phone-dash-sidebar-expanded"
                                    : "phone-dash-sidebar"
                            }
                            ref={sidebarRef}
                        >
                            {sidebarExpanded ? (
                                <>
                                    <div
                                        className="phone-dash-sidebar-logocontainer"
                                        onClick={() =>
                                            setSidebarExpanded(false)
                                        }
                                    >
                                        <div
                                            className="phone-dash-sidebar-logobutton"
                                            style={{
                                                justifyContent: "center",
                                            }}
                                        >
                                            <MdOutlineCancel />
                                        </div>
                                    </div>
                                    <div className="phone-dash-sidebar-half">
                                        <div
                                            className={
                                                currentPage == "home"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "home"
                                                    ? () =>
                                                          setCurrentPage("home")
                                                    : undefined
                                            }
                                        >
                                            <FaHome />
                                            {""}
                                            {t("home")}
                                        </div>
                                        <div
                                            className={
                                                currentPage == "prescouting"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "prescouting"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "prescouting",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaMagnifyingGlass />
                                            {""}
                                            {t("prescouting")}
                                        </div>
                                        <div
                                            className={
                                                currentPage == "matchscouting"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
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
                                            {t("matchscouting")}
                                        </div>
                                        <div
                                            className={
                                                currentPage == "summary"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "summary"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "summary",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaNewspaper />
                                            {""}
                                            {t("summary")}
                                        </div>
                                        <div
                                            className={
                                                currentPage == "competition"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "competition"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "competition",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaMedal />
                                            {""}
                                            {t("competition")}
                                        </div>
                                    </div>
                                    <div className="phone-dash-sidebar-bottomhalf">
                                        <div
                                            className={
                                                currentPage == "settings"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "settings"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "settings",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaGear />
                                            {""}
                                            {t("settings")}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="phone-dash-sidebar-logocontainer"
                                        onClick={() => setSidebarExpanded(true)}
                                    >
                                        <div
                                            className="phone-dash-sidebar-logobutton"
                                            style={{
                                                justifyContent: "center",
                                            }}
                                        >
                                            <RxHamburgerMenu />
                                        </div>
                                    </div>
                                    <div className="phone-dash-sidebar-half">
                                        <div
                                            className={
                                                currentPage == "home"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            style={{
                                                justifyContent: "center",
                                            }}
                                            onClick={
                                                currentPage !== "home"
                                                    ? () =>
                                                          setCurrentPage("home")
                                                    : undefined
                                            }
                                        >
                                            <FaHome />
                                        </div>
                                        <div
                                            className={
                                                currentPage == "prescouting"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            style={{
                                                justifyContent: "center",
                                            }}
                                            onClick={
                                                currentPage !== "prescouting"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "prescouting",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaMagnifyingGlass />
                                        </div>
                                        <div
                                            className={
                                                currentPage == "matchscouting"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            style={{
                                                justifyContent: "center",
                                            }}
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
                                        </div>
                                        <div
                                            className={
                                                currentPage == "summary"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            style={{
                                                justifyContent: "center",
                                            }}
                                            onClick={
                                                currentPage !== "summary"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "summary",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaNewspaper />
                                        </div>
                                        <div
                                            className={
                                                currentPage == "competition"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            style={{
                                                justifyContent: "center",
                                            }}
                                            onClick={
                                                currentPage !== "competition"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "competition",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaMedal />
                                        </div>
                                    </div>
                                    <div className="phone-dash-sidebar-bottomhalf">
                                        <div
                                            className={
                                                currentPage == "settings"
                                                    ? "phone-dash-sidebar-mainbutton-active"
                                                    : "phone-dash-sidebar-mainbutton"
                                            }
                                            onClick={
                                                currentPage !== "settings"
                                                    ? () =>
                                                          setCurrentPage(
                                                              "settings",
                                                          )
                                                    : undefined
                                            }
                                        >
                                            <FaGear />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-dashcontainer">
                        {renderCurrentPage()}
                    </div>
                </div>
            </>
        );
    }
}

export default Dashboard;
