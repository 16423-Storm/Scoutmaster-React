// Script Imports
import { useScreenType } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
    getCompKey,
    setCustom,
    setCompKey,
    useCustom,
    useCompKey,
} from "../../../scripts/localstorageutils";
import { Bounce, ToastContainer } from "react-toastify";

import data from "./comps.json";

import { FaRegSadTear } from "react-icons/fa";

import { WarningModal } from "../../components/popups";

function DashboardCompetition() {
    const { t } = useTranslation();

    const isCustom = useCustom((state) => state.isCustom);
    const currentKey = useCompKey((state) => state.compKey);

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const [customWarningVisible, setCustomWarningVisible] = useState(false);
    const [compWarningVisible, setCompWarningVisible] = useState(false);

    function switchToCustom() {
        setCustomWarningVisible(false);
        setCustom(true);
    }

    const [targetSwitchKey, setTargetSwitchKey] = useState("");

    function switchCompWarningPrompt(key: string) {
        setCompWarningVisible(true);
        setTargetSwitchKey(key);
    }

    function switchComp() {
        if (targetSwitchKey == "") {
            return;
        }
        setCompWarningVisible(false);
        setCompKey(targetSwitchKey);
        setSearch("");
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearch(value);
        filterData(value);
    };

    const filterData = (search: string) => {
        const filteredData = data
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.key.toLowerCase().includes(search.toLowerCase()),
            )
            .slice(0, 6);
        setFilteredData(filteredData);
    };

    useEffect(() => {
        if (search == "") {
            setFilteredData([]);
        }
    }, [search]);

    if (useScreenType() == "desktop") {
        return (
            <>
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
                {customWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("customwarning")}
                        onCancel={() => setCustomWarningVisible(false)}
                        onContinue={switchToCustom}
                    />
                )}
                {compWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("compwarning")}
                        onCancel={() => setCompWarningVisible(false)}
                        onContinue={switchComp}
                    />
                )}
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-comp-divider">
                        <div className="desktop-dash-comp-infodisplay">
                            <p className="desktop-dash-comp-infodisplay-title">
                                {t("currentlyscouting", {
                                    compkey: currentKey,
                                })}
                            </p>
                            <div className="desktop-dash-comp-searchcontainer">
                                <input
                                    className="desktop-dash-comp-search"
                                    value={search}
                                    onChange={handleInputChange}
                                />
                                {search && (
                                    <div className="desktop-dash-comp-searchdrop">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item) => (
                                                <div
                                                    key={item.key}
                                                    onClick={() =>
                                                        switchCompWarningPrompt(
                                                            item.key,
                                                        )
                                                    }
                                                >
                                                    <p>{item.name}</p>
                                                    <p className="notetext">
                                                        {item.key}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>
                                                <FaRegSadTear
                                                    style={{
                                                        paddingRight: "8px",
                                                    }}
                                                />
                                                {t("noresultsfound")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {isCustom ? (
                                <p
                                    className="notetext"
                                    style={{ padding: "10px" }}
                                >
                                    {t("compalreadycustom")}
                                </p>
                            ) : (
                                <>
                                    <button
                                        className="desktop-dash-comp-infodisplay-button"
                                        style={{ marginTop: "10px" }}
                                        onClick={() =>
                                            setCustomWarningVisible(true)
                                        }
                                        disabled={isCustom}
                                    >
                                        {t("switchtocustom")}
                                    </button>
                                    <p
                                        className="notetext"
                                        style={{ padding: "10px" }}
                                    >
                                        {t("customnotice")}
                                    </p>
                                </>
                            )}
                            <div
                                className="desktop-dash-comp-infodisplay-bordercontainer"
                                style={{ fontSize: "1.5rem" }}
                            >
                                {t("listofteams")}
                                <div className="desktop-dash-comp-infodisplay-table"></div>
                            </div>
                        </div>
                        <div className="desktop-dash-comp-infodisplay"></div>
                        <div className="desktop-dash-comp-infodisplay"></div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-comp-overflowhandler">
                        <div className="phone-dash-comp-divider">
                            <div className="phone-dash-comp-infodisplay"></div>
                            <div className="phone-dash-comp-infodisplay"></div>
                            <div className="phone-dash-comp-infodisplay"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardCompetition;
