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

import {
    deleteMember,
    useInvited,
    useMembers,
} from "../../../scripts/localstorage/group";

// Icon Imports
import { FaSun, FaMoon, FaTrash } from "react-icons/fa";

// Component Imports
import { LanguageDropdown } from "../../components/languagedropdown";

// Script Imports
import { languages } from "../../../scripts/localization";
import { WarningModal } from "../../components/popups";

function DashboardSettings() {
    const { t } = useTranslation();

    type SettingsPage = "general" | "account" | "groupmanagement";

    const [currentPage, setCurrentPage] = useState<SettingsPage>("general");

    function renderCurrentPage() {
        switch (currentPage) {
            case "general":
                return <GeneralPage />;
            case "account":
                return <AccountPage />;
            case "groupmanagement":
                return <GroupPage />;
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
    const { t } = useTranslation();
    const members = useMembers((state) => state.members);
    const invited = useInvited((state) => state.invited);

    const [deleteMemberWarningVisible, setDeleteMemberWarningVisible] =
        useState(false);

    const [targetEmail, setTargetEmail] = useState("");

    return (
        <>
            {deleteMemberWarningVisible && (
                <WarningModal
                    title={t("warning!")}
                    message={t("kickwarning", { email: targetEmail })}
                    onCancel={() => setDeleteMemberWarningVisible(false)}
                    onContinue={() => deleteMember(targetEmail, true, true)}
                />
            )}
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>{t("groupidcolon")}</p>
                <p>2</p>
            </div>
            <div
                className="desktop-dash-settings-infocontainer-setting"
                style={{ justifyContent: "center" }}
            >
                <div>
                    <p>Members:</p>
                    <div className="dash-settings-membertable">
                        {Object.entries(members).map(([memberNum, member]) => (
                            <div key={memberNum}>
                                {member.email}
                                <FaTrash
                                    onClick={() => {
                                        setTargetEmail(member.email);
                                        setDeleteMemberWarningVisible(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <p style={{ paddingTop: "30px" }}>Invited:</p>
                    <div className="dash-settings-membertable">
                        {invited.length > 0 ? (
                            invited.map((email) => (
                                <div key={email}>{email}</div>
                            ))
                        ) : (
                            <p>Nobody is invited</p>
                        )}
                    </div>

                    <button
                        className="desktop-dash-comp-infodisplay-button"
                        style={{ width: "30%", marginTop: "10px" }}
                    >
                        Invite Member
                    </button>
                </div>
            </div>
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>{t("customteamcountry")}</p>
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
