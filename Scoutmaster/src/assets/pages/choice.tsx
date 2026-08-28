import { useState } from "react";
import { useScreenType } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";

function Choice() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    // 0 -> Base 2 button choice
    // 1 -> Create new group onboarding
    // 2 -> Join existing group UI
    const [currentChoice, setCurrentChoice] = useState(0);

    if (screenType === "desktop") {
        return (
            <>
                <div className="desktop-signup-maincontainer">
                    <div
                        className="desktop-signup-infocontainer"
                        style={{ flexDirection: "row" }}
                    >
                        {currentChoice == 0 ? (
                            <>
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
                                    <FaMagnifyingGlass />{" "}
                                    {t("joinexistinggroup")}
                                </button>
                            </>
                        ) : currentChoice == 1 ? (
                            // TODO, MAKE THIS ACTUALLY BE THE UI OF CREATING A NEW GROUP ALONG WITH ONBOARDING
                            <>1</>
                        ) : (
                            // TODO, MAKE THIS ACTUALLY THE UI OF JOINING AN EXISTING GROUP
                            <>2</>
                        )}
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default Choice;
