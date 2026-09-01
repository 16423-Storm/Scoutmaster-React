// Library Imports
import {
    useScreenType,
    useSignedIn,
    useIsAkwardHeight,
    useIsLightMode,
    useFlipTheme,
    useSpecifyCustomCountry,
    flipCustomCountry,
} from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import i18n from "i18next";

import {
    addInvite,
    deleteInvite,
    deleteMember,
    useInvited,
    useMembers,
} from "../../../scripts/localstorage/group";

import { Blocker499 } from "../../components/blocker";
import type { ChangeEvent } from "react";

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

    const [targetEmail, setTargetEmail] = useState("");
    const [deleteMemberWarningVisible, setDeleteMemberWarningVisible] =
        useState(false);

    const [targetInviteEmail, setTargetInviteEmail] = useState("");
    const [deleteInviteWarningVisible, setDeleteInviteWarningVisible] =
        useState(false);

    const [inviteModalVisible, setInviteModalVisible] = useState(false);

    return (
        <>
            {deleteMemberWarningVisible && (
                <WarningModal
                    title={t("warning!")}
                    message={t("kickwarning", { email: targetEmail })}
                    onCancel={() => setDeleteMemberWarningVisible(false)}
                    onContinue={() => {
                        deleteMember(targetEmail, true, true);
                        setDeleteMemberWarningVisible(false);
                    }}
                />
            )}

            {deleteInviteWarningVisible && (
                <WarningModal
                    title={t("warning!")}
                    message={t("uninvitewarning", { email: targetInviteEmail })}
                    onCancel={() => setDeleteInviteWarningVisible(false)}
                    onContinue={() => {
                        deleteInvite(targetInviteEmail, true, true, false);
                        setDeleteInviteWarningVisible(false);
                    }}
                />
            )}

            {inviteModalVisible && (
                <InviteModal
                    onCancel={() => setInviteModalVisible(false)}
                    onContinue={() => setInviteModalVisible(false)}
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
                    <p>{t("members")}</p>
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
                    <p style={{ paddingTop: "30px" }}>{t("invited")}</p>
                    <div className="dash-settings-membertable">
                        {invited.length > 0 ? (
                            invited.map((email) => (
                                <div key={email}>
                                    {email}
                                    <FaTrash
                                        onClick={() => {
                                            setTargetInviteEmail(email);
                                            setDeleteInviteWarningVisible(true);
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>{t("nobodyinvited")}</p>
                        )}
                    </div>

                    <button
                        className="desktop-dash-comp-infodisplay-button"
                        style={{ width: "30%", marginTop: "10px" }}
                        onClick={() => setInviteModalVisible(true)}
                    >
                        {t("invitemember")}
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

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to invite the member on its own, onContinue is just for UI purposes
 */
function InviteModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: () => void;
}) {
    const { t } = useTranslation();

    const [inputEmail, setInputEmail] = useState("");

    const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputEmail(value);
    };

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "25vh" }}
                >
                    <p className="desktop-warningpopup-title">
                        {t("invitemember")}
                    </p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div
                            className="desktop-popupinput-parentcontainer"
                            style={{ justifyContent: "center" }}
                        >
                            <div
                                className="desktop-popupinput-childcontainer"
                                style={{ width: "80%" }}
                            >
                                <p>{t("email")}</p>
                                <input
                                    value={inputEmail}
                                    placeholder={t("placeholderemail")}
                                    maxLength={80}
                                    onChange={handleEmailInputChange}
                                    className={
                                        inputEmail.length === 80
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputEmail.length === 80
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputEmail.length}/80
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={() => {
                                addInvite(inputEmail, true, true, false);
                                onContinue();
                            }}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div
                    className="phone-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "30vh" }}
                >
                    <p className="phone-warningpopup-title">
                        {t("invitemember")}
                    </p>
                    <div className="phone-popupinput-highlightedbody">
                        <div
                            className="phone-popupinput-parentcontainer"
                            style={{ justifyContent: "center" }}
                        >
                            <div
                                className="phone-popupinput-childcontainer"
                                style={{ width: "90%" }}
                            >
                                <p>{t("email")}</p>
                                <input
                                    value={inputEmail}
                                    placeholder={t("placeholderemail")}
                                    maxLength={80}
                                    onChange={handleEmailInputChange}
                                    className={
                                        inputEmail.length === 80
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputEmail.length === 80
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputEmail.length}/80
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={() => {
                                addInvite(inputEmail, true, true, false);
                                onContinue();
                            }}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardSettings;
