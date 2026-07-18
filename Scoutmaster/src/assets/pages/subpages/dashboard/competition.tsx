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
    useMatches,
    deleteMatch,
} from "../../../scripts/localstorage";
import { Bounce, ToastContainer } from "react-toastify";

import data from "./comps.json";

import { FaRegSadTear, FaTrash } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

import { WarningModal } from "../../components/popups";

import {
    AddTeamModal,
    AddMatchModal,
} from "../../components/popups/CompetitionModals";

function DashboardCompetition() {
    const { t } = useTranslation();

    const isCustom = useCustom((state) => state.isCustom);
    const currentKey = useCompKey((state) => state.compKey);
    const teams = useTeams((state) => state.teams);
    const matches = useMatches((state) => state.matches);

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const [customWarningVisible, setCustomWarningVisible] = useState(false);
    const [compWarningVisible, setCompWarningVisible] = useState(false);
    const [addTeamVisible, setAddTeamVisible] = useState(false);
    const [deleteTeamWarningVisible, setDeleteTeamWarningVisible] =
        useState(false);
    const [addMatchVisible, setAddMatchVisible] = useState(false);
    const [deleteMatchWarningVisible, setDeleteMatchWarningVisible] =
        useState(false);

    const [targetDeleteTeam, setTargetDeleteTeam] = useState("");

    const [targetDeleteMatch, setTargetDeleteMatch] = useState("");

    function promptDeleteTeam(team: string) {
        setTargetDeleteTeam(team);
        setDeleteTeamWarningVisible(true);
    }

    function handleDeleteTeam(team: string) {
        deleteTeam(team, true);
        setDeleteTeamWarningVisible(false);
    }

    function switchToCustom() {
        setCustomWarningVisible(false);
        setCustom(true);
    }

    function promptDeleteMatch(match: string) {
        setTargetDeleteMatch(match);
        setDeleteMatchWarningVisible(true);
    }

    function handleDeleteMatch() {
        deleteMatch(targetDeleteMatch, true);
        setDeleteMatchWarningVisible(false);
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
                        onContinue={() => handleDeleteTeam(targetDeleteTeam)}
                    />
                )}

                {addMatchVisible && (
                    <AddMatchModal
                        onCancel={() => setAddMatchVisible(false)}
                        onContinue={() => setAddMatchVisible(false)}
                    />
                )}

                {deleteMatchWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("deletematchwarning", {
                            number: targetDeleteMatch,
                        })}
                        onCancel={() => setDeleteMatchWarningVisible(false)}
                        onContinue={handleDeleteMatch}
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
                        <div
                            className="desktop-dash-comp-infodisplay"
                            style={{ width: "66%" }}
                        >
                            <p className="desktop-dash-comp-infodisplay-title">
                                {t("totalmatches", {
                                    num: Object.keys(matches ?? {}).length,
                                })}
                            </p>
                            <div className="desktop-dash-comp-infodisplay-matchtable">
                                <div className="desktop-dash-comp-infodisplay-matchtable-row">
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        {t("match")}
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        {t("red1")}
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        {t("red2")}
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        {t("blue1")}
                                    </div>
                                    <div className="desktop-dash-comp-infodisplay-matchtable-column2345header">
                                        {t("blue2")}
                                    </div>
                                </div>
                                {Object.entries(matches).map(
                                    ([matchNum, match]) => (
                                        <div
                                            className="desktop-dash-comp-infodisplay-matchtable-row"
                                            key={matchNum}
                                            onClick={() =>
                                                promptDeleteMatch(matchNum)
                                            }
                                        >
                                            <div className="desktop-dash-comp-infodisplay-matchtable-column1">
                                                Q{matchNum}
                                            </div>
                                            <div className="desktop-dash-comp-infodisplay-matchtable-column23">
                                                {match.red1}
                                            </div>
                                            <div className="desktop-dash-comp-infodisplay-matchtable-column23">
                                                {match.red2}
                                            </div>
                                            <div className="desktop-dash-comp-infodisplay-matchtable-column45">
                                                {match.blue1}
                                            </div>
                                            <div className="desktop-dash-comp-infodisplay-matchtable-column45">
                                                {match.blue2}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                            <button
                                className="desktop-dash-comp-infodisplay-greenbutton"
                                onClick={() => setAddMatchVisible(true)}
                            >
                                <IoAddCircleOutline /> {t("addmatch")}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
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
                        onContinue={() => handleDeleteTeam(targetDeleteTeam)}
                    />
                )}

                {addMatchVisible && (
                    <AddMatchModal
                        onCancel={() => setAddMatchVisible(false)}
                        onContinue={() => setAddMatchVisible(false)}
                    />
                )}

                {deleteMatchWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("deletematchwarning", {
                            number: targetDeleteMatch,
                        })}
                        onCancel={() => setDeleteMatchWarningVisible(false)}
                        onContinue={handleDeleteMatch}
                    />
                )}

                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-comp-overflowhandler">
                        <div className="phone-dash-comp-divider">
                            <div className="phone-dash-comp-infodisplay">
                                <p className="phone-dash-comp-infodisplay-title">
                                    {t("currentlyscouting", {
                                        compkey: currentKey,
                                    })}
                                </p>
                                <div className="phone-dash-comp-searchcontainer">
                                    <input
                                        className="phone-dash-comp-search"
                                        value={search}
                                        onChange={handleInputChange}
                                    />
                                    {search && (
                                        <div className="phone-dash-comp-searchdrop">
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
                                            className="phone-dash-comp-infodisplay-button"
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
                                    className="phone-dash-comp-infodisplay-bordercontainer"
                                    style={{ fontSize: "1.5rem" }}
                                >
                                    {t("listofteams")}
                                    <div className="phone-dash-comp-infodisplay-table">
                                        {Object.entries(teams).map(
                                            ([teamNum, team]) => (
                                                <div key={teamNum}>
                                                    {teamNum} - {team.name}
                                                    <FaTrash
                                                        className="phone-dash-comp-infodisplay-table-deletebutton"
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
                                    <button
                                        onClick={() => setAddTeamVisible(true)}
                                    >
                                        <IoAddCircleOutline /> {t("addteam")}
                                    </button>
                                </div>
                            </div>
                            <div className="phone-dash-comp-infodisplay">
                                <p className="phone-dash-comp-infodisplay-title">
                                    {t("totalmatches", {
                                        num: Object.keys(matches ?? {}).length,
                                    })}
                                </p>
                                <div className="phone-dash-comp-infodisplay-matchtable">
                                    <div className="phone-dash-comp-infodisplay-matchtable-row">
                                        <div className="phone-dash-comp-infodisplay-matchtable-column2345header">
                                            {t("match")}
                                        </div>
                                        <div className="phone-dash-comp-infodisplay-matchtable-column2345header">
                                            {t("red1")}
                                        </div>
                                        <div className="phone-dash-comp-infodisplay-matchtable-column2345header">
                                            {t("red2")}
                                        </div>
                                        <div className="phone-dash-comp-infodisplay-matchtable-column2345header">
                                            {t("blue1")}
                                        </div>
                                        <div className="phone-dash-comp-infodisplay-matchtable-column2345header">
                                            {t("blue2")}
                                        </div>
                                    </div>
                                    {Object.entries(matches).map(
                                        ([matchNum, match]) => (
                                            <div
                                                className="phone-dash-comp-infodisplay-matchtable-row"
                                                key={matchNum}
                                                onClick={() =>
                                                    promptDeleteMatch(matchNum)
                                                }
                                            >
                                                <div className="phone-dash-comp-infodisplay-matchtable-column1">
                                                    Q{matchNum}
                                                </div>
                                                <div className="phone-dash-comp-infodisplay-matchtable-column23">
                                                    {match.red1}
                                                </div>
                                                <div className="phone-dash-comp-infodisplay-matchtable-column23">
                                                    {match.red2}
                                                </div>
                                                <div className="phone-dash-comp-infodisplay-matchtable-column45">
                                                    {match.blue1}
                                                </div>
                                                <div className="phone-dash-comp-infodisplay-matchtable-column45">
                                                    {match.blue2}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                                <button
                                    className="phone-dash-comp-infodisplay-greenbutton"
                                    onClick={() => setAddMatchVisible(true)}
                                >
                                    <IoAddCircleOutline /> {t("addmatch")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardCompetition;
