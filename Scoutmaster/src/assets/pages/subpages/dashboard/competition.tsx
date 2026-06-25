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
} from "../../../scripts/localstorageutils";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";

import data from "./comps.json";

import { FaRegSadTear } from "react-icons/fa";

import { WarningModal } from "../../components/popups";

function DashboardCompetition() {
    const { t } = useTranslation();

    const isCustom = useCustom((state) => state.isCustom);

    const [currentKey, setCurrentKey] = useState(getCompKey());

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const [customWarningVisible, setCustomWarningVisible] = useState(false);
    const [compWarningVisible, setCompWarningVisible] = useState(false);

    function switchToCustom() {
        setCustomWarningVisible(false);
        setCustom();
    }

    const [targetSwitchKey, setTargetSwitchKey] = useState("");

    function switchCompWarningPrompt(key: string) {
        setCompWarningVisible(true);
        setTargetSwitchKey(key);
    }

    // function switchComp() {
    //     if (targetSwitchKey == "") {
    //         return;
    //     }
    //     setCompWarningVisible(false);
    //     setCompKey(targetSwitchKey);
    //     setCurrentKey(targetSwitchKey);
    //     setSearch("");
    // }

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
                {customWarningVisible && (
                    <WarningModal
                        title="Warning!"
                        message="If you switch this competition to custom, it will keep all existing data, but it will no longer get new info from the FTC API"
                        onCancel={() => setCustomWarningVisible(false)}
                        onContinue={switchToCustom}
                    />
                )}
                {compWarningVisible && (
                    <WarningModal
                        title="Warning!"
                        message="If you switch to this competition, all existing scouting data will be deleted!"
                        onCancel={() => setCompWarningVisible(false)}
                        onContinue={() => setCompWarningVisible(false)}
                    />
                )}
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-comp-divider">
                        <div className="desktop-dash-comp-infodisplay">
                            <p className="desktop-dash-comp-infodisplay-title">
                                Currently Scouting: {currentKey}
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
                                                No Results Found
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                className="desktop-dash-comp-infodisplay-button"
                                style={{ marginTop: "10px" }}
                                onClick={() => setCustomWarningVisible(true)}
                                disabled={isCustom}
                            >
                                Switch to Custom
                            </button>
                            <p className="notetext" style={{ padding: "10px" }}>
                                If you want to scout a custom competition, type
                                "CUSTOM", you can also switch the current
                                competition to a custom one.
                            </p>
                            <div
                                className="desktop-dash-comp-infodisplay-bordercontainer"
                                style={{ fontSize: "1.5rem" }}
                            >
                                List of Teams:
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
