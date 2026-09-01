import { useState, useEffect, type ChangeEvent } from "react";
import { useScreenType } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";

import { GridLoader } from "react-spinners";
import { createGroup, joinGroup } from "../scripts/auth";

function Choice() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    // 0 -> Base 2 button choice
    // 1 -> Create new group onboarding
    // 2 -> Join existing group UI
    const [currentChoice, setCurrentChoice] = useState(0);

    useEffect(() => {
        if (currentChoice === 1) {
            handleCreateGroup();
        }
    }, [currentChoice]);

    // TODO, ADD PROPER ERROR SHOWING
    const handleCreateGroup = async () => {
        const success = await createGroup();

        if (success) {
            window.location.href = "/dashboard";
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
            window.location.href = "/dashboard";
        } else {
            setJoinError(true);
            console.error("e");
        }
    };

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
                                onClick={() => {
                                    setCurrentChoice(1);
                                }}
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
                                Creating Group
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
                            {joinError === true && <p>Error joining group.</p>}
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
        return <></>;
    }
}

export default Choice;
