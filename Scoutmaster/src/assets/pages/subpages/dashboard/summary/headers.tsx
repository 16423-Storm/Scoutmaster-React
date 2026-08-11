//!
//!
//!
//!
//!
// THIS IS NOT GOOD PRACTICE, BUT FOR SIMPLICITY, "SORTED" IS BEING TYPED AS ANY, THIS WILL BE FIXED LATER
//!
//!
//!
//!
//!
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import {
    useCustom,
    useSummary,
    updateSummary,
    movePicks,
} from "../../../../scripts/localstorage";

import {
    FaSort,
    FaSortUp,
    FaSortDown,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";

export function Tab1({
    sorted,
    sortBy,
    setSortBy,
    sortDown,
    setSortDown,
    selected,
}: {
    sorted: any;
    sortBy: number;
    setSortBy: Dispatch<SetStateAction<number>>;
    sortDown: boolean;
    setSortDown: Dispatch<SetStateAction<boolean>>;
    selected: { id: number; name: string } | null;
}) {
    const { t } = useTranslation();

    const isCustom = useCustom((state) => state.isCustom);

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

                    {sorted.map((team: any) => (
                        <div
                            className={`desktop-dash-summary-row ${
                                team.rank === undefined && !isCustom
                                    ? "unranked-team"
                                    : ""
                            } ${
                                selected?.name.startsWith(`${team.teamId} -`)
                                    ? "selected-team"
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

export function Tab2({
    teamsBelow,
}: {
    teamsBelow: { number: string; name: string }[];
}) {
    const { t } = useTranslation();

    const summary = useSummary((state) => state.summary);

    useEffect(() => {
        if (summary.picks.length == 0 && teamsBelow.length > 0) {
            updateSummary({
                picks: teamsBelow.map((team) => team.number),
            });
        }
    }, []);

    const belowPicks = summary.picks.filter((pick) =>
        teamsBelow.some((team) => team.number === pick),
    );

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-summary-table">
                    <div
                        className="desktop-dash-summary-row"
                        style={{ position: "sticky", top: 0 }}
                    >
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "20%" }}
                        >
                            Order
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "80%" }}
                        >
                            Team
                        </div>
                    </div>

                    {belowPicks.map((teamNumber, index) => {
                        const team = teamsBelow.find(
                            (team) => team.number === teamNumber,
                        );

                        if (!team) return null;

                        return (
                            <div
                                className="desktop-dash-summary-row"
                                key={team.number}
                            >
                                <div
                                    className="desktop-dash-summary-cell"
                                    style={{
                                        width: "20%",
                                    }}
                                >
                                    <div className="summary-reorder">
                                        {index !== 0 && (
                                            <FaArrowUp
                                                onClick={() =>
                                                    movePicks(index, -1)
                                                }
                                            />
                                        )}
                                        {index !== belowPicks.length - 1 && (
                                            <FaArrowDown
                                                onClick={() =>
                                                    movePicks(index, 1)
                                                }
                                            />
                                        )}
                                    </div>
                                    {index + 1}
                                </div>

                                <div
                                    className="desktop-dash-summary-cell"
                                    style={{ width: "80%" }}
                                >
                                    {team.number} - {team.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export function Tab3() {
    const { t } = useTranslation();

    if (useScreenType() == "desktop") {
        return <></>;
    } else {
        return <></>;
    }
}
