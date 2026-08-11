import { useState, useEffect } from "react";

import { useScreenType } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { updateSummary, getNumOfTeams } from "../../../scripts/localstorage";

import { FaRegStar, FaMountain } from "react-icons/fa";
import { BsAlignMiddle } from "react-icons/bs";

import type { ChangeEvent } from "react";

import {
    useTeams,
    useMatches,
    useCompKey,
    useCustom,
    useGroupTeam,
    useSummary,
} from "../../../scripts/localstorage";

import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Label,
} from "@headlessui/react";

import { Tab1, Tab2, Tab3 } from "./summary/headers";

function DashboardSummary() {
    const { t } = useTranslation();

    const [currentTab, setCurrentTab] = useState(0);

    const currentKey = useCompKey((state) => state.compKey);
    const isCustom = useCustom((state) => state.isCustom);
    const groupTeam = useGroupTeam((state) => state.team);

    const [sortBy, setSortBy] = useState(0);
    const [sortDown, setSortDown] = useState(false);

    const teams = useTeams((state) => state.teams);
    const matches = useMatches((state) => state.matches);

    const comboBoxTeams = Object.entries(teams).map(
        ([number, team], index) => ({
            id: index + 1,
            name: `${number} - ${(team as { name: string }).name}`,
        }),
    );

    const startingIndex = Object.keys(teams).findIndex(
        (number) => number === String(groupTeam),
    );

    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<{
        id: number;
        name: string;
    } | null>(comboBoxTeams[startingIndex >= 0 ? startingIndex : 0] ?? null);

    const filteredTeams =
        query === ""
            ? comboBoxTeams.slice(0, 10)
            : comboBoxTeams
                  .filter((team) => {
                      return team.name
                          .toLowerCase()
                          .includes(query.toLowerCase());
                  })
                  .slice(0, 10);

    const [ranks, setRanks] = useState<Record<number, number>>({});

    useEffect(() => {
        if (isCustom) {
            setRanks({});
            return;
        }

        getRanks(currentKey).then((result) => {
            setRanks(result);
        });
    }, [currentKey, isCustom]);

    const stats = Object.entries(teams).map(([teamId, team]) => {
        const teamNumber = Number(teamId);
        const matchScores = [];

        for (const match of Object.values(matches)) {
            const teamIndex = match.teams.indexOf(teamNumber);
            if (teamIndex === -1) {
                continue;
            }

            const score =
                match.scores[teamIndex][0] * 3 +
                match.scores[teamIndex][1] +
                match.scores[teamIndex][2] * 2 +
                match.scores[teamIndex][3] * 3 +
                match.scores[teamIndex][4] * 3 +
                match.scores[teamIndex][5] * 1 +
                match.scores[teamIndex][6] * 2 +
                match.scores[teamIndex][7] * 5;

            matchScores.push(score);
        }

        const sortedScores = [...matchScores].sort((a, b) => a - b);

        const average =
            matchScores.length > 0
                ? matchScores.reduce((sum, score) => sum + score, 0) /
                  matchScores.length
                : 0;

        const median =
            sortedScores.length === 0
                ? 0
                : sortedScores.length % 2 === 0
                  ? (sortedScores[sortedScores.length / 2 - 1] +
                        sortedScores[sortedScores.length / 2]) /
                    2
                  : sortedScores[Math.floor(sortedScores.length / 2)];

        const peak = matchScores.length > 0 ? Math.max(...matchScores) : 0;

        return {
            teamId,
            rank: isCustom ? undefined : ranks[teamNumber],
            team,
            average,
            median,
            peak,
        };
    });

    const highestAverage = stats.reduce(
        (max, team) => (team.average > max.average ? team : max),
        stats[0],
    );

    const highestMedian = stats.reduce(
        (max, team) => (team.median > max.median ? team : max),
        stats[0],
    );

    const highestPeak = stats.reduce(
        (max, team) => (team.peak > max.peak ? team : max),
        stats[0],
    );

    const highAverage = highestAverage
        ? `${highestAverage.teamId} - ${highestAverage.average.toFixed(1)}`
        : "";

    const highMedian = highestMedian
        ? `${highestMedian.teamId} - ${highestMedian.median.toFixed(1)}`
        : "";

    const highPeak = highestPeak
        ? `${highestPeak.teamId} - ${highestPeak.peak}`
        : "";

    const currentTeamRank = ranks[Number(selected?.name.split(" - ")[0])];

    const teamsBelow = stats
        .filter(
            (team) => team.rank !== undefined && team.rank > currentTeamRank,
        )
        .map((team) => ({
            number: team.teamId,
            name: team.team.name,
        }));

    const teamsAbove = stats
        .filter(
            (team) => team.rank !== undefined && team.rank < currentTeamRank,
        )
        .map((team) => ({
            number: team.teamId,
            name: team.team.name,
        }));

    const sorted = [...stats].sort((a, b) => {
        if (!isCustom) {
            if (a.rank === undefined && b.rank !== undefined) return 1;
            if (a.rank !== undefined && b.rank === undefined) return -1;
            if (a.rank === undefined && b.rank === undefined) return 0;
        }

        let aValue: number;
        let bValue: number;

        switch (sortBy) {
            case 0:
                if (!isCustom && a.rank !== undefined && b.rank !== undefined) {
                    aValue = a.rank;
                    bValue = b.rank;
                } else {
                    aValue = a.average;
                    bValue = b.average;
                }
                break;

            case 1:
                aValue = a.average;
                bValue = b.average;
                break;

            case 2:
                aValue = a.median;
                bValue = b.median;
                break;

            case 3:
                aValue = a.peak;
                bValue = b.peak;
                break;

            default:
                aValue = 0;
                bValue = 0;
        }

        const primary = sortDown ? bValue - aValue : aValue - bValue;

        if (primary !== 0) {
            return primary;
        }

        if (!isCustom) {
            if (a.rank !== undefined && b.rank !== undefined) {
                return a.rank - b.rank;
            }
        }

        return 0;
    });

    async function getRanks(
        eventCode: string,
    ): Promise<Record<number, number>> {
        const query = `
            query ExampleQuery($season: Int!, $code: String!) {
                eventByCode(season: $season, code: $code) {
                    teams {
                        stats {
                            ... on TeamEventStats2025 {
                                rank
                            }
                        }
                        team {
                            number
                        }
                    }
                }
            }
        `;

        const response = await fetch("https://api.ftcscout.org/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    season: 2025,
                    code: eventCode,
                },
            }),
        });

        const result = await response.json();

        const ranks: Record<number, number> = {};

        for (const entry of result.data.eventByCode.teams) {
            if (entry.stats) {
                ranks[entry.team.number] = entry.stats.rank;
            }
        }

        return ranks;
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <div
                    className="desktop-dash-maincontainer"
                    style={{
                        paddingLeft: "50px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <div className="desktop-dash-summary-topbar">
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaRegStar style={{ color: "#4F81A8" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{highAverage}</p>
                                <p>Highest Average</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <BsAlignMiddle style={{ color: "#4F9A91" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{highMedian}</p>
                                <p>Highest Median</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaMountain style={{ color: "#C28A4A" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{highPeak}</p>
                                <p>Highest Peak</p>
                            </div>
                        </div>
                    </div>
                    <div className="desktop-dash-summary-infocontainer">
                        <div className="desktop-dash-summary-infocontainer-tabcontainer">
                            <div className="desktop-dash-summary-infocontainer-tabgroup">
                                <div
                                    className="desktop-dash-summary-infocontainer-tab-left"
                                    onClick={() => setCurrentTab(0)}
                                >
                                    All Teams
                                </div>
                                <div
                                    className="desktop-dash-summary-infocontainer-tab-left"
                                    onClick={() => setCurrentTab(1)}
                                >
                                    Top Picks
                                </div>
                                <div
                                    className="desktop-dash-summary-infocontainer-tab-left"
                                    onClick={() => setCurrentTab(2)}
                                >
                                    Accept/Reject
                                </div>
                            </div>
                            <div className="desktop-dash-summary-infocontainer-tabgroup">
                                <div className="desktop-dash-summary-infocontainer-tab">
                                    <Field>
                                        <Label>Your Team:</Label>
                                        <Combobox
                                            value={selected}
                                            onChange={setSelected}
                                            onClose={() => setQuery("")}
                                        >
                                            <ComboboxInput
                                                aria-label="Assignee"
                                                displayValue={(
                                                    team: {
                                                        id: number;
                                                        name: string;
                                                    } | null,
                                                ) => team?.name ?? ""}
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                            />
                                            <ComboboxOptions
                                                anchor="bottom"
                                                className="desktop-dash-summary-infocontainer-tab-combooptions border empty:invisible"
                                            >
                                                {filteredTeams.map((team) => (
                                                    <ComboboxOption
                                                        key={team.id}
                                                        value={team}
                                                        className="data-focus:bg-blue-100"
                                                    >
                                                        {team.name}
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        </Combobox>
                                    </Field>
                                </div>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-tablecontainer">
                            {currentTab == 0 ? (
                                <Tab1
                                    sorted={sorted}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    setSortDown={setSortDown}
                                    sortDown={sortDown}
                                    selected={selected}
                                />
                            ) : currentTab == 1 ? (
                                <Tab2 teamsBelow={teamsBelow} />
                            ) : (
                                <Tab3 teamsAbove={teamsAbove} />
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default DashboardSummary;
