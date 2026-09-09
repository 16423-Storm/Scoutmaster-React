// Library Imports
import {
    useScreenType,
    useSignedIn,
    useIsAkwardHeight,
    useIsLightMode,
    useFlipTheme,
    useSpecifyCustomCountry,
    flipCustomCountry,
    useIsAdmin,
} from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useMemo } from "react";
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
import { MdOutlineLock } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

// Component Imports
import { LanguageDropdown } from "../../components/languagedropdown";
import { WarningModal } from "../../components/popups";

// Script Imports
import { languages } from "../../../scripts/localization";
import {
    leaveGroup,
    deleteAccount,
    logOut,
    changePassword,
    deleteGroup,
} from "../../../scripts/auth";

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
                            {useIsAdmin() && (
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
                            )}
                        </div>
                        <div
                            style={{
                                width: "72%",
                                gap: "30px",
                                display: "flex",
                                margin: "auto",
                                padding: "20px",
                                flexDirection: "column",
                            }}
                        >
                            <div className="desktop-dash-settings-infocontainer">
                                {renderCurrentPage()}
                            </div>
                            {currentPage !== "general" && (
                                <div className="desktop-dash-settings-infocontainer-danger">
                                    {currentPage == "account" ? (
                                        <AccountPageDanger
                                            groupId={
                                                JSON.parse(
                                                    localStorage.getItem(
                                                        "group",
                                                    ) || "{}",
                                                ).groupId
                                            }
                                        />
                                    ) : (
                                        <GroupPageDanger
                                            groupId={
                                                JSON.parse(
                                                    localStorage.getItem(
                                                        "group",
                                                    ) || "{}",
                                                ).groupId
                                            }
                                        />
                                    )}
                                </div>
                            )}
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
    async function handleLogout() {
        const success = await logOut();

        if (success) {
            console.log("Logged out successfully");
        } else {
            console.error("Failed to log out");
        }
    }

    const [changeVisible, setChangeVisible] = useState(false);

    return (
        <>
            {changeVisible && (
                <ChangePasswordModal
                    onCancel={() => setChangeVisible(false)}
                    onContinue={() => setChangeVisible(false)}
                />
            )}
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>Log Out:</p>
                <button
                    onClick={handleLogout}
                    className="desktop-dash-settings-infocontainer-setting-buttonplus"
                >
                    Log Out
                </button>
            </div>
            <div className="desktop-dash-settings-infocontainer-setting">
                <p>Change Password:</p>
                <button
                    onClick={() => setChangeVisible(true)}
                    className="desktop-dash-settings-infocontainer-setting-buttonplus"
                >
                    Change
                </button>
            </div>
        </>
    );
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
                <p>
                    {JSON.parse(localStorage.getItem("group") || "{}").groupId}
                </p>
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
                                <p
                                    style={{
                                        maxWidth: "80%",
                                        minWidth: 0,
                                        fontSize: "0.9rem",
                                        overflowWrap: "anywhere",
                                        padding: "3px",
                                    }}
                                >
                                    {member.email}
                                </p>
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
                                    <p
                                        style={{
                                            maxWidth: "80%",
                                            minWidth: 0,
                                            fontSize: "0.9rem",
                                            overflowWrap: "anywhere",
                                            padding: "3px",
                                        }}
                                    >
                                        {email}
                                    </p>
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
                        style={{ width: "90%", marginTop: "10px" }}
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

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to change the password on its own, onContinue is just for UI purposes
 */
function ChangePasswordModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: () => void;
}) {
    const { t } = useTranslation();

    const [oldPassword, setOldPassword] = useState("");
    const [oldVisible, setOldVisible] = useState(false);

    const handleOldChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setOldPassword(value);
    };

    const [newPassword, setNewPassword] = useState("");
    const [newVisible, setNewVisible] = useState(false);

    const handleNewChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewPassword(value);
    };

    const hasRules = useMemo(() => {
        const p = newPassword;
        return {
            length: p.length >= 8,
            upper: /[A-Z]/.test(p),
            lower: /[a-z]/.test(p),
            number: /\d/.test(p),
            symbol: /[^A-Za-z0-9]/.test(p),
        };
    }, [newPassword]);

    const passwordValid = useMemo(() => {
        return Object.values(hasRules).every(Boolean);
    }, [hasRules]);

    const inputClass = (valid: boolean) => (valid ? "valid" : "invalid");
    const showPasswordRules = newPassword.length > 0;

    const [spinning, setSpinning] = useState(false);
    const [oldError, setOldError] = useState(false);

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{
                        height: useIsAkwardHeight()
                            ? newPassword.length > 0
                                ? "82vh"
                                : "67vh"
                            : newPassword.length > 0
                              ? "57vh"
                              : "42vh",
                    }}
                >
                    <p className="desktop-warningpopup-title">
                        Change Password
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
                                <p className="desktop-signup-text">
                                    <MdOutlineLock className="desktop-signup-input-icon" />{" "}
                                    {t("oldpasswordwithcolon")}
                                </p>
                                <div className="desktop-signup-password-input-wrapper">
                                    <input
                                        className={"desktop-signup-input"}
                                        type={oldVisible ? "text" : "password"}
                                        value={oldPassword}
                                        name="password"
                                        onChange={handleOldChange}
                                        style={{ color: "var(--black)" }}
                                    />

                                    <button
                                        type="button"
                                        className="desktop-signup-eye-icon"
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            setOldVisible((prev) => !prev);
                                        }}
                                    >
                                        {oldVisible ? (
                                            <IoMdEyeOff
                                                size={20}
                                                style={{
                                                    color: "var(--black)",
                                                }}
                                            />
                                        ) : (
                                            <IoMdEye
                                                size={20}
                                                style={{
                                                    color: "var(--black)",
                                                }}
                                            />
                                        )}
                                    </button>
                                </div>
                                <p className="desktop-signup-text">
                                    <MdOutlineLock className="desktop-signup-input-icon" />{" "}
                                    {t("newpasswordwithcolon")}
                                </p>
                                <div
                                    className="desktop-signup-password-input-wrapper"
                                    style={{ flexDirection: "column" }}
                                >
                                    <input
                                        className={`desktop-signup-input ${
                                            newPassword.length > 0 &&
                                            !passwordValid
                                                ? "invalid"
                                                : ""
                                        }`}
                                        id="avoidinputsonspecial"
                                        type={newVisible ? "text" : "password"}
                                        value={newPassword}
                                        name="password"
                                        onChange={handleNewChange}
                                        style={{
                                            color: "var(--black)",
                                            backgroundColor: "var(--white)",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="desktop-signup-eye-icon"
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            setNewVisible((prev) => !prev);
                                        }}
                                    >
                                        {newVisible ? (
                                            <IoMdEyeOff
                                                size={20}
                                                style={{
                                                    color: "var(--black)",
                                                }}
                                            />
                                        ) : (
                                            <IoMdEye
                                                size={20}
                                                style={{
                                                    color: "var(--black)",
                                                }}
                                            />
                                        )}
                                    </button>
                                    <p
                                        className={`desktop-signup-text-hidden ${
                                            showPasswordRules ? "show" : ""
                                        }`}
                                    >
                                        {t("mustinclude")}
                                    </p>

                                    <ul
                                        className={`desktop-signup-passwordlist ${
                                            showPasswordRules ? "show" : ""
                                        }`}
                                    >
                                        <li
                                            className={inputClass(
                                                hasRules.length,
                                            )}
                                        >
                                            {t("passwordrequirement1")}
                                        </li>
                                        <li
                                            className={inputClass(
                                                hasRules.upper,
                                            )}
                                        >
                                            {t("passwordrequirement2")}
                                        </li>
                                        <li
                                            className={inputClass(
                                                hasRules.lower,
                                            )}
                                        >
                                            {t("passwordrequirement3")}
                                        </li>
                                        <li
                                            className={inputClass(
                                                hasRules.number,
                                            )}
                                        >
                                            {t("passwordrequirement4")}
                                        </li>
                                        <li
                                            className={inputClass(
                                                hasRules.symbol,
                                            )}
                                        >
                                            {t("passwordrequirement5")}
                                        </li>
                                    </ul>
                                    {oldError && <p>Old password incorrect</p>}
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
                            onClick={async () => {
                                setOldError(false);
                                setSpinning(true);
                                const result = await changePassword(
                                    oldPassword,
                                    newPassword,
                                );
                                if (result != 1) {
                                    onContinue();
                                }
                                setSpinning(false);
                                setOldError(true);
                            }}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

function AccountPageDanger({ groupId }: { groupId: number }) {
    const { t } = useTranslation();

    async function handleLeaveGroup() {
        const success = await leaveGroup(groupId);

        if (success) {
            console.log("Successfully left group");
        } else {
            console.error("Failed to leave group");
        }
    }

    async function handleDeleteAccount() {
        const success = await deleteAccount();

        if (success) {
            console.log("Successfully deleted account");
        } else {
            console.error("Failed to delete account");
        }
    }

    const [deleteAccountWarning, setDeleteAccountWarning] = useState(false);
    const [leaveGroupWarning, setLeaveGroupWarning] = useState(false);

    return (
        <>
            {deleteAccountWarning && (
                <WarningModal
                    title={t("warning!")}
                    message={
                        "This will PERMANENTLY delete your account, are you sure you want to continue?"
                    }
                    onCancel={() => setDeleteAccountWarning(false)}
                    onContinue={() => {
                        handleDeleteAccount();
                        setDeleteAccountWarning(false);
                    }}
                />
            )}

            {leaveGroupWarning && (
                <WarningModal
                    title={t("warning!")}
                    message={
                        "You will not be able to re-enter the group unless someone else invites you, if you are the last member, leaving will PERMANENTLY delete the group. Are you sure you want to continue?"
                    }
                    onCancel={() => setLeaveGroupWarning(false)}
                    onContinue={() => {
                        handleLeaveGroup();
                        setLeaveGroupWarning(false);
                    }}
                />
            )}
            <p
                style={{
                    fontWeight: 900,
                    color: "var(--clr-danger-a0)",
                    fontSize: "1.6rem",
                    padding: "20px",
                }}
            >
                Danger Zone
            </p>

            <div className="desktop-dash-settings-infocontainer-setting-danger">
                <p>Leave Group:</p>
                <button onClick={() => setLeaveGroupWarning(true)}>
                    Leave
                </button>
            </div>

            <div className="desktop-dash-settings-infocontainer-setting-danger">
                <p>Delete Account:</p>
                <button onClick={() => setDeleteAccountWarning(true)}>
                    Delete
                </button>
            </div>
        </>
    );
}

function GroupPageDanger({ groupId }: { groupId: number }) {
    const { t } = useTranslation();

    const [deleteWarning, setDeleteWarning] = useState(false);

    return (
        <>
            {deleteWarning && (
                <WarningModal
                    title={t("warning!")}
                    message={
                        "This will PERMANENTLY delete ALL of your group's data, are you sure you want to continue?"
                    }
                    onCancel={() => setDeleteWarning(false)}
                    onContinue={() => {
                        deleteGroup(groupId);
                        setDeleteWarning(false);
                    }}
                />
            )}

            <p
                style={{
                    fontWeight: 900,
                    color: "var(--clr-danger-a0)",
                    fontSize: "1.6rem",
                    padding: "20px",
                }}
            >
                Danger Zone
            </p>
            <div className="desktop-dash-settings-infocontainer-setting-danger">
                <p>Delete Group:</p>
                <button onClick={() => setDeleteWarning(true)}>Delete</button>
            </div>
        </>
    );
}

export default DashboardSettings;
