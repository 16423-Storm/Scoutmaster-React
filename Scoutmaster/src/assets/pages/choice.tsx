import { useState, useEffect, type ChangeEvent } from "react";
import { useScreenType } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";

import { GridLoader } from "react-spinners";
import { createGroup, joinGroup, supabase } from "../scripts/auth";

function Choice() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    // 0 -> Base 2 button choice
    // 1 -> Create new group onboarding
    // 2 -> Join existing group UI
    const [currentChoice, setCurrentChoice] = useState(0);

    // useEffect(() => {
    //     if (currentChoice === 1) {
    //         handleCreateGroup();
    //     }
    // }, [currentChoice]);

    // TODO, ADD PROPER ERROR SHOWING
    const handleCreateGroup = async () => {
        setCurrentChoice(1);
        const success = await createGroup();

        if (success) {
            window.location.hash = "/dashboard";
        } else {
            setCurrentChoice(0);
        }
    };

    const [groupID, setGroupID] = useState("");
    const [joinError, setJoinError] = useState(false);
    const handleJoinGroup = async () => {
        const parsedId = parseInt(groupID, 10);
        if (isNaN(parsedId)) {
            setJoinError(true);
            return;
        }

        setJoinError(false);

        const success = await joinGroup(parsedId);

        if (success) {
            window.location.hash = "/dashboard";
        } else {
            setJoinError(true);
            console.error("e");
        }
    };

    useEffect(() => {
        const handleAuth = async () => {
            const hash = window.location.hash;
            const queryString = hash.split('?')[1]; 
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('code');

            if (code) {
                console.log("Got into code");
                const { data, error } =
                    await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error("Authentication failed:", error);
                    return;
                }

                console.log("Logged in!", data.session);

                window.history.replaceState(
                    {},
                    document.title,
                    "/choice"
                );
            }
        };

        handleAuth();
    }, []);

    if (screenType === "desktop") {
        return (
            <>
                <div className="desktop-signup-maincontainer">
                    {currentChoice == 0 ? (
                        <div
                            className="desktop-signup-infocontainer"
                            style={{ flexDirection: "row" }}
                        >
                            <button
                                className="desktop-signup-button"
                                onClick={handleCreateGroup}
                            >
                                <FaPlus /> {t("createnewgroup")}
                            </button>
                            <button
                                className="desktop-signup-button"
                                onClick={() => {
                                    setCurrentChoice(2);
                                }}
                            >
                                <FaMagnifyingGlass /> {t("joinexistinggroup")}
                            </button>
                        </div>
                    ) : currentChoice == 1 ? (
                        <>
                            <GridLoader color="white" size={100} />
                            <p
                                style={{
                                    padding: "30px",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "3rem",
                                }}
                            >
                                {t("creatinggroup")}
                            </p>
                        </>
                    ) : (
                        <div className="desktop-signup-infocontainer">
                            <p className="desktop-signup-title">
                                {t("joingroup")}
                            </p>
                            <p style={{ padding: "20px" }}>
                                {t("groupidfindhelp")}
                            </p>
                            <p className="desktop-signup-text">
                                <FaMagnifyingGlass className="desktop-signup-input-icon" />{" "}
                                {t("groupid")}
                            </p>
                            <input
                                className={"desktop-signup-input"}
                                value={groupID}
                                name="email"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setGroupID(e.target.value);
                                }}
                                autoFocus
                                maxLength={9}
                            />
                            {joinError === true && (
                                <p>{t("errorjoininggroup")}</p>
                            )}
                            <button
                                className="desktop-signup-button"
                                onClick={handleJoinGroup}
                                style={{
                                    justifyContent: "center",
                                    gap: "30px",
                                }}
                            >
                                <FaMagnifyingGlass /> {t("joingroup")}
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-signup-maincontainer">
                    {currentChoice == 0 ? (
                        <div
                            className="phone-signup-infocontainer"
                            style={{ flexDirection: "column" }}
                        >
                            <button
                                className="phone-signup-button"
                                onClick={() => {
                                    setCurrentChoice(1);
                                }}
                            >
                                <FaPlus /> {t("createnewgroup")}
                            </button>
                            <button
                                className="phone-signup-button"
                                onClick={() => {
                                    setCurrentChoice(2);
                                }}
                            >
                                <FaMagnifyingGlass /> {t("joinexistinggroup")}
                            </button>
                        </div>
                    ) : currentChoice == 1 ? (
                        <>
                            <GridLoader color="white" size={100} />
                            <p
                                style={{
                                    padding: "30px",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "3rem",
                                }}
                            >
                                {t("creatinggroup")}
                            </p>
                        </>
                    ) : (
                        <div className="phone-signup-infocontainer">
                            <p className="phone-signup-title">
                                {t("joingroup")}
                            </p>
                            <p style={{ padding: "20px" }}>
                                {t("groupidfindhelp")}
                            </p>
                            <p className="phone-signup-text">
                                <FaMagnifyingGlass className="phone-signup-input-icon" />{" "}
                                {t("groupid")}
                            </p>
                            <input
                                className={"phone-signup-input"}
                                value={groupID}
                                name="email"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setGroupID(e.target.value);
                                }}
                                autoFocus
                                maxLength={9}
                            />
                            {joinError === true && (
                                <p>{t("errorjoininggroup")}</p>
                            )}
                            <button
                                className="phone-signup-button"
                                onClick={handleJoinGroup}
                                style={{
                                    justifyContent: "center",
                                    gap: "30px",
                                }}
                            >
                                <FaMagnifyingGlass /> {t("joingroup")}
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default Choice;
