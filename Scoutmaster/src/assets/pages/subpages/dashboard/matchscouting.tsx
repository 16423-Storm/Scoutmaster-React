import { useState } from "react";
import { useScreenType } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import DashboardMatchPage from "./matchscout/matchpage";

import type { Match } from "../../../scripts/localstorage";
import { useMatches } from "../../../scripts/localstorage";

function DashboardMatchScouting() {
    const { t } = useTranslation();
    const matches = useMatches((state) => state.matches);

    const [selectedMatch, setSelectedMatch] = useState<Match>({
        teams: [],
        red1: NaN,
        red2: NaN,
        blue1: NaN,
        blue2: NaN,
        scores: [[], [], [], []],
    });
    const [isMatchPageOpen, setIsMatchPageOpen] = useState(false);

    if (useScreenType() == "desktop") {
        return (
            <>
                {isMatchPageOpen && (
                    <DashboardMatchPage
                        match={selectedMatch}
                        onBack={() => setIsMatchPageOpen(false)}
                    />
                )}
                <div
                    className="desktop-dash-comp-infodisplay"
                    style={{ width: "85%" }}
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
                        {Object.entries(matches).map(([matchNum, match]) => (
                            <div
                                className="desktop-dash-comp-infodisplay-matchtable-row"
                                key={matchNum}
                                onClick={() => {
                                    setSelectedMatch(match);
                                    setIsMatchPageOpen(true);
                                }}
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
                        ))}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                {isMatchPageOpen && (
                    <DashboardMatchPage
                        match={selectedMatch}
                        onBack={() => setIsMatchPageOpen(false)}
                    />
                )}
                <div
                    className="phone-dash-comp-infodisplay"
                    style={{ padding: "10px 2px", maxHeight: "95%" }}
                >
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
                        {Object.entries(matches).map(([matchNum, match]) => (
                            <div
                                className="phone-dash-comp-infodisplay-matchtable-row"
                                key={matchNum}
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
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardMatchScouting;
