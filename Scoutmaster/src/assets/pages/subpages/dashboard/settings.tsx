// Library Imports
import {
    useScreenType,
    useSignedIn,
    useIsLightMode,
    useFlipTheme,
    useSpecifyCustomCountry,
    flipCustomCountry,
} from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import i18n from "i18next";

// Icon Imports
import { FaSun, FaMoon } from "react-icons/fa";

// Component Imports
import { LanguageDropdown } from "../../components/languagedropdown";

// Script Imports
import { languages } from "../../../scripts/localization";

function DashboardSettings() {
    const { t } = useTranslation();

    type SettingsPage = "general" | "account" | "groupmanagement" | "process";

    const [currentPage, setCurrentPage] = useState<SettingsPage>("general");

    function renderCurrentPage() {
        switch (currentPage) {
            case "general":
                return <GeneralPage />;
            case "account":
                return <AccountPage />;
            case "groupmanagement":
                return <GroupPage />;
            case "process":
                return <ProcessPage />;
        }
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <div
                    className="desktop-dash-maincontainer"
                    style={{ alignItems: "center" }}
                >
                    <div className="desktop-dash-settings-contentcontainer">
                        <div className="desktop-dash-settings-navcontainer">
                            <button
                                className={
                                    currentPage === "general"
                                        ? "desktop-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("general")}
                            >
                                {t("general")}
                            </button>
                            <button
                                className={
                                    currentPage === "account"
                                        ? "desktop-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("account")}
                            >
                                {t("account")}
                            </button>
                            <button
                                className={
                                    currentPage === "groupmanagement"
                                        ? "desktop-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentPage("groupmanagement")
                                }
                            >
                                {t("groupmanagement")}
                            </button>
                            <button
                                className={
                                    currentPage === "process"
                                        ? "desktop-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("process")}
                            >
                                {t("process")}
                            </button>
                        </div>
                        <div className="desktop-dash-settings-infocontainer">
                            {renderCurrentPage()}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    className="phone-dash-maincontainer"
                    style={{ alignItems: "center" }}
                >
                    <div className="phone-dash-settings-contentcontainer">
                        <div className="phone-dash-settings-navcontainer">
                            <button
                                className={
                                    currentPage === "general"
                                        ? "phone-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("general")}
                            >
                                {t("general")}
                            </button>
                            <button
                                className={
                                    currentPage === "account"
                                        ? "phone-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("account")}
                            >
                                {t("account")}
                            </button>
                            <button
                                className={
                                    currentPage === "groupmanagement"
                                        ? "phone-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentPage("groupmanagement")
                                }
                            >
                                {t("groupmanagement")}
                            </button>
                            <button
                                className={
                                    currentPage === "process"
                                        ? "phone-dash-settings-navcontainer-activebutton"
                                        : ""
                                }
                                onClick={() => setCurrentPage("process")}
                            >
                                {t("process")}
                            </button>
                        </div>
                        <div className="phone-dash-settings-infocontainer">
                            {renderCurrentPage()}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function GeneralPage() {
    const { t } = useTranslation();
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const currentLanguage =
        languages.find((lang) => lang.code === i18n.language) || languages[0];

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setLanguageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>{t("darklightmode")}</p>
                <button onClick={useFlipTheme()}>
                    {useIsLightMode() == true ? <FaMoon /> : <FaSun />}
                </button>
            </div>
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>{t("language")}</p>
                <LanguageDropdown
                    dropdownRef={dropdownRef}
                    setLanguageMenuOpen={setLanguageMenuOpen}
                    currentLanguage={currentLanguage}
                    languageMenuOpen={languageMenuOpen}
                    languages={languages}
                    color={true}
                />
            </div>
        </>
    );
}

function AccountPage() {
    return <></>;
}

function GroupPage() {
    return <></>;
}

function ProcessPage() {
    const { t } = useTranslation();

    return (
        <>
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>Specify Custom Team Country</p>
                <input
                    type="checkbox"
                    checked={useSpecifyCustomCountry() === true}
                    onChange={flipCustomCountry()}
                />
            </div>
        </>
    );
}

export default DashboardSettings;
