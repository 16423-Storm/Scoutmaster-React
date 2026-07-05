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
    useTeams,
    deleteTeam,
} from "../../../scripts/localstorageutils";
import { Bounce, ToastContainer } from "react-toastify";

import data from "./comps.json";

import { FaRegSadTear, FaTrash } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

import { WarningModal, AddTeamModal } from "../../components/popups";

function DashboardCompetition() {
    const { t } = useTranslation();

    const isCustom = useCustom((state) => state.isCustom);
    const currentKey = useCompKey((state) => state.compKey);
    const teams = useTeams((state) => state.teams);

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const [customWarningVisible, setCustomWarningVisible] = useState(false);
    const [compWarningVisible, setCompWarningVisible] = useState(false);
    const [addTeamVisible, setAddTeamVisible] = useState(false);
    const [deleteTeamWarningVisible, setDeleteTeamWarningVisible] =
        useState(false);

    const [targetDeleteTeam, setTargetDeleteTeam] = useState("");

    function promptDeleteTeam(team: string) {
        setTargetDeleteTeam(team);
        setDeleteTeamWarningVisible(true);
    }

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
                {addTeamVisible && (
                    <AddTeamModal
                        onCancel={() => setAddTeamVisible(false)}
                        onContinue={() => setAddTeamVisible(false)}
                    />
                )}
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
                {deleteTeamWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("deleteteamwarning", {
                            number: targetDeleteTeam,
                        })}
                        onCancel={() => setDeleteTeamWarningVisible(false)}
                        onContinue={() => deleteTeam(targetDeleteTeam, true)}
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
                                <div className="desktop-dash-comp-infodisplay-table">
                                    {Object.entries(teams).map(
                                        ([teamNum, team]) => (
                                            <div key={teamNum}>
                                                {teamNum} - {team.name}
                                                <FaTrash
                                                    className="desktop-dash-comp-infodisplay-table-deletebutton"
                                                    onClick={() =>
                                                        promptDeleteTeam(
                                                            teamNum,
                                                        )
                                                    }
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                                <button onClick={() => setAddTeamVisible(true)}>
                                    <IoAddCircleOutline /> {t("addteam")}
                                </button>
                            </div>
                        </div>
                        <div className="desktop-dash-comp-infodisplay">
                            <p className="desktop-dash-comp-infodisplay-title">
                                {t("totalmatches", { num: "50" })}
                            </p>
                            <div className="desktop-dash-comp-infodisplay-matchtable">
                                <div className="desktop-dash-comp-infodisplay-matchtable-row">
                                    <div
                                        className="desktop-dash-comp-infodisplay-matchtable-column1"
                                        style={{ fontWeight: "bolder" }}
                                    >
                                        Match
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        Red 1
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        Red 2
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        Blue 1
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        Blue 2
                                    </div>
                                </div>
                                <div className="desktop-dash-comp-infodisplay-matchtable-row">
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column1">
                                        Q1
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column23">
                                        16423
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column23">
                                        16423
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column45">
                                        16423
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column45">
                                        16423
                                    </div>
                                </div>
                            </div>
                        </div>
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
