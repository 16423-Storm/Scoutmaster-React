import { useScreenType, useAdmin } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { useState } from "react";

import { useTeams } from "../../../scripts/localstorage";

import { Progress3 } from "../../components/progressbar";
import Flag from "../../components/flag";

import { getNumOfQuestions } from "../../../scripts/localstorage";

function DashboardPrescout() {
    const { t } = useTranslation();

    const teams = useTeams((state) => state.teams);

    const percentageCounts = [0, 0, 0];

    Object.values(teams).forEach((team) => {
        const numOfQuestions = getNumOfQuestions();
        if (team.data.length === numOfQuestions) {
            percentageCounts[2]++;
        } else if (team.data.length > 0) {
            percentageCounts[1]++;
        } else {
            percentageCounts[0]++;
        }
    });

    const percentageTotal =
        percentageCounts[0] + percentageCounts[1] + percentageCounts[2];
    const percentages = [
        (percentageCounts[2] / percentageTotal) * 100,
        (percentageCounts[1] / percentageTotal) * 100,
        (percentageCounts[0] / percentageTotal) * 100,
    ];

    if (useScreenType() == "desktop") {
        return (
            <div className="desktop-dash-maincontainer">
                <div className="desktop-dash-prescout-divider">
                    <div className="desktop-dash-prescout-infodisplay">
                        <div className="desktop-dash-prescout-infodisplay-titlecontainer">
                            <p>
                                Fully Scouted:{" "}
                                <span
                                    style={{ color: "rgba(99, 255, 107, 0.6)" }}
                                >
                                    {percentageCounts[2]}
                                </span>
                            </p>

                            <p>
                                Partially Scouted:{" "}
                                <span
                                    style={{ color: "rgba(255, 196, 0, 0.74)" }}
                                >
                                    {percentageCounts[1]}
                                </span>
                            </p>
                            <p>
                                Not Scouted:{" "}
                                <span
                                    style={{ color: "rgba(235, 54, 54, 0.6)" }}
                                >
                                    {percentageCounts[0]}
                                </span>
                            </p>
                        </div>
                        <Progress3
                            color3="rgb(146, 45, 45)"
                            color2="rgb(221, 169, 0)"
                            color1="rgb(45, 146, 50)"
                            percents={[10, 20, 70]}
                        />
                        <div
                            className="desktop-dash-prescout-infodisplay-bordercontainer"
                            style={{ fontSize: "1.5rem", marginTop: "10px" }}
                        >
                            {t("listofteams")}
                            <div className="desktop-dash-prescout-infodisplay-table">
                                {Object.entries(teams).map(
                                    ([teamNum, team]) => (
                                        <div key={teamNum}>
                                            <StatusColor
                                                numAnswered={team.data.length}
                                            />
                                            {teamNum} - {team.name}{" "}
                                            {team.code ? (
                                                <Flag
                                                    code={team.code}
                                                    imageClass="desktop-dash-prescout-infodisplay-table-flag"
                                                />
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="desktop-dash-prescout-admin-infodisplay"
                        style={
                            useAdmin() ? undefined : { borderStyle: "dashed" }
                        }
                    ></div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default DashboardPrescout;

function StatusColor({ numAnswered }: { numAnswered: number }) {
    const numOfQuestions = getNumOfQuestions();
    if (numOfQuestions == numAnswered) {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-green"></div>
        );
    } else if (numAnswered > 0) {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-yellow"></div>
        );
    } else {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-red"></div>
        );
    }
}
