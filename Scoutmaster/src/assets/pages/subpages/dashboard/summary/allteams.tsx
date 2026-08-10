import { useState, useEffect } from "react";

import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import {
    useTeams,
    useMatches,
    useCompKey,
    useCustom,
} from "../../../../scripts/localstorage";

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function AllTeams({
    setHighAverage,
    setHighMedian,
    setHighPeak,
}: {
    setHighAverage: React.Dispatch<React.SetStateAction<string>>;
    setHighMedian: React.Dispatch<React.SetStateAction<string>>;
    setHighPeak: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { t } = useTranslation();

    const currentKey = useCompKey((state) => state.compKey);
    const isCustom = useCustom((state) => state.isCustom);

    const [sortBy, setSortBy] = useState(0);
    const [sortDown, setSortDown] = useState(true);

    const teams = useTeams((state) => state.teams);
    const matches = useMatches((state) => state.matches);

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

    setHighAverage(
        `${highestAverage.teamId} - ${highestAverage.average.toFixed(1)}`,
    );

    setHighMedian(
        `${highestMedian.teamId} - ${highestMedian.median.toFixed(1)}`,
    );

    setHighPeak(`${highestPeak.teamId} - ${highestPeak.peak}`);

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
                <div className="desktop-dash-summary-table">
                    <div
                        className="desktop-dash-summary-row"
                        style={{ position: "sticky", top: 0 }}
                    >
                        {!isCustom && (
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "10%" }}
                            >
                                Rank{" "}
                                {sortBy === 0 ? (
                                    sortDown ? (
                                        <FaSortDown
                                            onClick={() => setSortDown(false)}
                                            className="desktop-dash-summary-header-sort"
                                        />
                                    ) : (
                                        <FaSortUp
                                            onClick={() => setSortDown(true)}
                                            className="desktop-dash-summary-header-sort"
                                        />
                                    )
                                ) : (
                                    <FaSort
                                        className="desktop-dash-summary-header-sort"
                                        onClick={() => {
                                            setSortDown(true);
                                            setSortBy(0);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        <div
                            className="desktop-dash-summary-cell"
                            style={
                                isCustom ? { width: "55%" } : { width: "45%" }
                            }
                        >
                            Team
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            Average Points{" "}
                            {sortBy === 1 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="desktop-dash-summary-header-sort"
                                    onClick={() => {
                                        setSortDown(true);
                                        setSortBy(1);
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            Median Points{" "}
                            {sortBy === 2 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="desktop-dash-summary-header-sort"
                                    onClick={() => {
                                        setSortDown(true);
                                        setSortBy(2);
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            Peak{" "}
                            {sortBy === 3 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="desktop-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="desktop-dash-summary-header-sort"
                                    onClick={() => {
                                        setSortDown(true);
                                        setSortBy(3);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {sorted.map((team) => (
                        <div
                            className={`desktop-dash-summary-row ${
                                team.rank === undefined && !isCustom
                                    ? "unranked-team"
                                    : ""
                            }`}
                            key={team.teamId}
                        >
                            {!isCustom && (
                                <div
                                    className="desktop-dash-summary-cell"
                                    style={{ width: "10%" }}
                                >
                                    {team.rank}
                                </div>
                            )}
                            <div
                                className="desktop-dash-summary-cell"
                                style={
                                    isCustom
                                        ? { width: "55%" }
                                        : { width: "45%" }
                                }
                            >
                                {team.teamId} - {team.team.name}
                            </div>
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.average.toFixed(1)}
                            </div>
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.median.toFixed(1)}
                            </div>
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.peak}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default AllTeams;
