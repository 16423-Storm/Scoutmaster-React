import {
    useScreenType,
    useIsAkwardHeight,
    useSpecifyCustomCountry,
} from "../../../scripts/multipageutils";
import { Blocker499 } from "../blocker";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { addTeam, addMatch } from "../../../scripts/localstorage";

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
    const [inputCode, setInputCode] = useState("");

    const handleNumberInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setInputNumber(value);
    };

    const handleTeamInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputTeam(value);
    };

    const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputCode(value);
    };

    const specifyCustomCountry = useSpecifyCustomCountry();

    function handleContinue() {
        onContinue();
        if (specifyCustomCountry) {
            addTeam(inputNumber, inputTeam, true, inputCode);
        } else {
            addTeam(inputNumber, inputTeam, true);
        }
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={
                        specifyCustomCountry
                            ? { height: useIsAkwardHeight() ? "55vh" : "40vh" }
                            : { height: useIsAkwardHeight() ? "40vh" : "25vh" }
                    }
                >
                    <p className="desktop-warningpopup-title">{t("addteam")}</p>
                    <div className="desktop-popupinput-highlightedbody">
                        {specifyCustomCountry && (
                            <div
                                className="desktop-popupinput-parentcontainer"
                                style={{ justifyContent: "center" }}
                            >
                                <div className="desktop-popupinput-childcontainer">
                                    <p>{t("countrycode")}</p>
                                    <input
                                        placeholder={t("examplecountrycode")}
                                        maxLength={7}
                                        value={inputCode}
                                        onChange={handleCodeChange}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("teamnumber")}</p>
                                <input
                                    placeholder={t("exampleteamnumber4")}
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={inputNumber}
                                    onChange={handleNumberInputChange}
                                />
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("teamname")}</p>
                                <input
                                    value={inputTeam}
                                    placeholder={t("exampleteamname")}
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
                    style={
                        specifyCustomCountry
                            ? { height: useIsAkwardHeight() ? "55vh" : "40vh" }
                            : { height: useIsAkwardHeight() ? "40vh" : "30vh" }
                    }
                >
                    <p className="phone-warningpopup-title">{t("addteam")}</p>
                    <div className="phone-popupinput-highlightedbody">
                        {specifyCustomCountry && (
                            <div
                                className="phone-popupinput-parentcontainer"
                                style={{ justifyContent: "center" }}
                            >
                                <div className="phone-popupinput-childcontainer">
                                    <p>{t("countrycode")}</p>
                                    <input
                                        placeholder={t("examplecountrycode")}
                                        maxLength={7}
                                        value={inputCode}
                                        onChange={handleCodeChange}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("teamnumber")}</p>
                                <input
                                    placeholder={t("exampleteamnumber4")}
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={inputNumber}
                                    onChange={handleNumberInputChange}
                                />
                            </div>
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("teamname")}</p>
                                <input
                                    value={inputTeam}
                                    placeholder={t("exampleteamname")}
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

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to add the match on its own, onContinue is just for UI purposes
 * @returns The popup for adding a match to the list
 */
export function AddMatchModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: () => void;
}) {
    const { t } = useTranslation();

    const [red1Input, setRed1Input] = useState(0);
    const [red2Input, setRed2Input] = useState(1);
    const [blue1Input, setBlue1Input] = useState(2);
    const [blue2Input, setBlue2Input] = useState(3);

    const handleRed1Change = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setRed1Input(value);
    };

    const handleRed2Change = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setRed2Input(value);
    };

    const handleBlue1Change = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setBlue1Input(value);
    };

    const handleBlue2Change = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setBlue2Input(value);
    };

    function handleContinue() {
        onContinue();
        addMatch(red1Input, red2Input, blue1Input, blue2Input, true);
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{
                        width: "50vw",
                        height: useIsAkwardHeight() ? "50vh" : "35vh",
                    }}
                >
                    <p className="desktop-warningpopup-title">
                        {t("addmatch")}
                    </p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("red1colon")}</p>
                                <input
                                    value={red1Input}
                                    placeholder={t("exampleteamnumber1")}
                                    type="number"
                                    onChange={handleRed1Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        red1Input > 999999 ||
                                        red1Input < -999999
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("red2colon")}</p>
                                <input
                                    value={red2Input}
                                    placeholder={t("exampleteamnumber2")}
                                    type="number"
                                    onChange={handleRed2Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        red2Input > 999999 ||
                                        red2Input < -999999
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("blue1colon")}</p>
                                <input
                                    value={blue1Input}
                                    placeholder={t("exampleteamnumber3")}
                                    type="number"
                                    onChange={handleBlue1Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        blue1Input > 999999 ||
                                        blue1Input < -999999
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("blue2colon")}</p>
                                <input
                                    value={blue2Input}
                                    placeholder={t("exampleteamnumber4")}
                                    type="number"
                                    onChange={handleBlue2Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        blue2Input > 999999 ||
                                        blue2Input < -999999
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
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
                    style={{
                        width: "90vw",
                        height: useIsAkwardHeight() ? "55vh" : "40vh",
                    }}
                >
                    <p className="phone-warningpopup-title">{t("addmatch")}</p>
                    <div className="phone-popupinput-highlightedbody">
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("red1colon")}</p>
                                <input
                                    value={red1Input}
                                    placeholder={t("exampleteamnumber1")}
                                    type="number"
                                    onChange={handleRed1Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        red1Input > 999999 ||
                                        red1Input < -999999
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("red2colon")}</p>
                                <input
                                    value={red2Input}
                                    placeholder={t("exampleteamnumber2")}
                                    type="number"
                                    onChange={handleRed2Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        red2Input > 999999 ||
                                        red2Input < -999999
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("blue1colon")}</p>
                                <input
                                    value={blue1Input}
                                    placeholder={t("exampleteamnumber3")}
                                    type="number"
                                    onChange={handleBlue1Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        blue1Input > 999999 ||
                                        blue1Input < -999999
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                            </div>
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("blue2colon")}</p>
                                <input
                                    value={blue2Input}
                                    placeholder={t("exampleteamnumber4")}
                                    type="number"
                                    onChange={handleBlue2Change}
                                    max={999999}
                                    min={-999999}
                                    className={
                                        blue2Input > 999999 ||
                                        blue2Input < -999999
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
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
