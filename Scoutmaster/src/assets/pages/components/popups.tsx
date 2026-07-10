import { useScreenType } from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { addTeam } from "../../scripts/localstorage";

type PropsOfWarningModal = {
    title: string;
    message: string;
    onContinue: () => void;
    onCancel: () => void;
};
/**
 * Confirms whether user wants to continue with action
 */
export function WarningModal({
    title,
    message,
    onContinue,
    onCancel,
}: PropsOfWarningModal) {
    const { t } = useTranslation();
    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div className="desktop-warningpopup">
                    <p className="desktop-warningpopup-title">{title}</p>
                    <p className="desktop-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={onContinue}
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
                <div className="phone-warningpopup">
                    <p className="phone-warningpopup-title">{title}</p>
                    <p className="phone-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={onContinue}
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
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to add the team on its own, onContinue is just for UI purposes
 * @returns The popup for adding a team to the list
 */
export function AddTeamModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: () => void;
}) {
    const { t } = useTranslation();

    const [inputNumber, setInputNumber] = useState(0);
    const [inputTeam, setInputTeam] = useState("");

    const handleNumberInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setInputNumber(value);
    };

    const handleTeamInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputTeam(value);
    };

    function handleContinue() {
        onContinue();
        addTeam(inputNumber, inputTeam, true);
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                >
                    <p className="desktop-warningpopup-title">Add Team</p>
                    <div className="desktop-popupinput-parentcontainer">
                        <div className="desktop-popupinput-childcontainer">
                            <p>Team Number:</p>
                            <input
                                placeholder="e.g. 16423"
                                type="number"
                                min={0}
                                max={99999}
                                value={inputNumber}
                                onChange={handleNumberInputChange}
                            />
                        </div>
                        <div className="desktop-popupinput-childcontainer">
                            <p>Team Name:</p>
                            <input
                                value={inputTeam}
                                placeholder="e.g. Storm"
                                maxLength={90}
                                onChange={handleTeamInputChange}
                                className={
                                    inputTeam.length === 90
                                        ? "desktop-popupinput-maxedinput"
                                        : undefined
                                }
                            />
                            <div
                                style={
                                    inputTeam.length === 90
                                        ? { color: "red" }
                                        : undefined
                                }
                            >
                                {inputTeam.length}/90
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
                            onClick={handleContinue}
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
                >
                    <p className="phone-warningpopup-title">Add Team</p>
                    <div className="phone-popupinput-parentcontainer">
                        <div className="phone-popupinput-childcontainer">
                            <p>Team Number:</p>
                            <input
                                placeholder="e.g. 16423"
                                type="number"
                                min={0}
                                max={99999}
                                value={inputNumber}
                                onChange={handleNumberInputChange}
                            />
                        </div>
                        <div className="phone-popupinput-childcontainer">
                            <p>Team Name:</p>
                            <input
                                value={inputTeam}
                                placeholder="e.g. Storm"
                                maxLength={90}
                                onChange={handleTeamInputChange}
                                className={
                                    inputTeam.length === 90
                                        ? "phone-popupinput-maxedinput"
                                        : undefined
                                }
                            />
                            <div
                                style={
                                    inputTeam.length === 90
                                        ? { color: "red" }
                                        : undefined
                                }
                            >
                                {inputTeam.length}/90
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
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
