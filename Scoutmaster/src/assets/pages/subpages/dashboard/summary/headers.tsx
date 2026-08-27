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
export function Tab1({
    sorted,
    sortBy,
    setSortBy,
    sortDown,
    setSortDown,
    selected,
    setTargetTeam,
    setSummaryPageVisible,
}: {
    sorted: any;
    sortBy: number;
    setSortBy: Dispatch<SetStateAction<number>>;
    sortDown: boolean;
    setSortDown: Dispatch<SetStateAction<boolean>>;
    selected: { id: number; name: string } | null;
    setTargetTeam: Dispatch<SetStateAction<string>>;
    setSummaryPageVisible: Dispatch<SetStateAction<boolean>>;
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
                                {t("rank")}{" "}
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
                            {t("team")}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("averagepoints")}{" "}
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
                            {t("medianpoints")}{" "}
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
                            {t("peak")}{" "}
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
                            onClick={() => {
                                setTargetTeam(team.teamId);
                                setSummaryPageVisible(true);
                            }}
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
        return (
            <>
                <div className="phone-dash-summary-table">
                    <div
                        className="phone-dash-summary-row"
                        style={{ position: "sticky", top: 0 }}
                    >
                        {!isCustom && (
                            <div
                                className="phone-dash-summary-cell"
                                style={{ width: "10%" }}
                            >
                                {t("rank")}{" "}
                                {sortBy === 0 ? (
                                    sortDown ? (
                                        <FaSortDown
                                            onClick={() => setSortDown(false)}
                                            className="phone-dash-summary-header-sort"
                                        />
                                    ) : (
                                        <FaSortUp
                                            onClick={() => setSortDown(true)}
                                            className="phone-dash-summary-header-sort"
                                        />
                                    )
                                ) : (
                                    <FaSort
                                        className="phone-dash-summary-header-sort"
                                        onClick={() => {
                                            setSortDown(true);
                                            setSortBy(0);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        <div
                            className="phone-dash-summary-cell"
                            style={
                                isCustom ? { width: "55%" } : { width: "45%" }
                            }
                        >
                            {t("team")}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("averagepoints")}{" "}
                            {sortBy === 1 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="phone-dash-summary-header-sort"
                                    onClick={() => {
                                        setSortDown(true);
                                        setSortBy(1);
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("medianpoints")}{" "}
                            {sortBy === 2 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="phone-dash-summary-header-sort"
                                    onClick={() => {
                                        setSortDown(true);
                                        setSortBy(2);
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("peak")}{" "}
                            {sortBy === 3 ? (
                                sortDown ? (
                                    <FaSortDown
                                        onClick={() => setSortDown(false)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                ) : (
                                    <FaSortUp
                                        onClick={() => setSortDown(true)}
                                        className="phone-dash-summary-header-sort"
                                    />
                                )
                            ) : (
                                <FaSort
                                    className="phone-dash-summary-header-sort"
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
                            className={`phone-dash-summary-row ${
                                team.rank === undefined && !isCustom
                                    ? "unranked-team"
                                    : ""
                            } ${
                                selected?.name.startsWith(`${team.teamId} -`)
                                    ? "selected-team"
                                    : ""
                            }`}
                            key={team.teamId}
                            onClick={() => {
                                setTargetTeam(team.teamId);
                                setSummaryPageVisible(true);
                            }}
                        >
                            {!isCustom && (
                                <div
                                    className="phone-dash-summary-cell"
                                    style={{ width: "10%" }}
                                >
                                    {team.rank}
                                </div>
                            )}
                            <div
                                className="phone-dash-summary-cell"
                                style={
                                    isCustom
                                        ? { width: "55%" }
                                        : { width: "45%" }
                                }
                            >
                                {team.teamId} - {team.team.name}
                            </div>
                            <div
                                className="phone-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.average.toFixed(1)}
                            </div>
                            <div
                                className="phone-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.median.toFixed(1)}
                            </div>
                            <div
                                className="phone-dash-summary-cell"
                                style={{ width: "15%" }}
                            >
                                {team.peak}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}

export function Tab2({
    teamsBelow,
}: {
    teamsBelow: { number: string; name: string }[];
}) {
    const { t } = useTranslation();

    const summary = useSummary((state) => state.summary);

    const defaultPicks = teamsBelow.map((team) => team.number);

    useEffect(() => {
        if (summary.picks.length === 0) {
            updateSummary({
                picks: defaultPicks,
            });
        } else {
            const validPicks = summary.picks.filter((pick) =>
                defaultPicks.includes(pick),
            );

            const newPicks = [
                ...validPicks,
                ...defaultPicks.filter((pick) => !validPicks.includes(pick)),
            ];

            if (
                newPicks.length !== summary.picks.length ||
                newPicks.some((pick, i) => pick !== summary.picks[i])
            ) {
                updateSummary({
                    picks: newPicks,
                });
            }
        }
    }, [teamsBelow, summary.picks]);

    const belowPicks =
        summary.picks.length > 0
            ? summary.picks.filter((pick) =>
                  teamsBelow.some((team) => team.number === pick),
              )
            : teamsBelow.map((team) => team.number);

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
                            {t("order")}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "80%" }}
                        >
                            {t("team")}
                        </div>
                    </div>

                    {belowPicks.length === 0 ? (
                        <div className="desktop-dash-summary-row">
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "100%" }}
                            >
                                {t("lastplacenopicks")}
                            </div>
                        </div>
                    ) : (
                        belowPicks.map((teamNumber, index) => {
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
                                            {index !==
                                                belowPicks.length - 1 && (
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
                        })
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    className="phone-dash-summary-table"
                    style={{ width: "120vw" }}
                >
                    <div
                        className="phone-dash-summary-row"
                        style={{ position: "sticky", top: 0 }}
                    >
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "30%" }}
                        >
                            {t("order")}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "70%" }}
                        >
                            {t("team")}
                        </div>
                    </div>

                    {belowPicks.map((teamNumber, index) => {
                        const team = teamsBelow.find(
                            (team) => team.number === teamNumber,
                        );

                        if (!team) return null;

                        return (
                            <div
                                className="phone-dash-summary-row"
                                key={team.number}
                            >
                                <div
                                    className="phone-dash-summary-cell"
                                    style={{
                                        width: "30%",
                                    }}
                                >
                                    <div
                                        className="summary-reorder"
                                        style={{
                                            flexDirection: "row",
                                            gap: "15px",
                                            fontSize: "1.5rem",
                                        }}
                                    >
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
                                    className="phone-dash-summary-cell"
                                    style={{ width: "70%" }}
                                >
                                    {team.number} - {team.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

export function Tab3({
    teamsAbove,
}: {
    teamsAbove: { number: string; name: string }[];
}) {
    const { t } = useTranslation();

    const summary = useSummary((state) => state.summary);

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
                            style={{ width: "10%" }}
                        >
                            {t("accept")}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "10%" }}
                        >
                            {t("reject")}
                        </div>
                        <div
                            className="desktop-dash-summary-cell"
                            style={{ width: "80%" }}
                        >
                            {t("team")}
                        </div>
                    </div>

                    {teamsAbove.length === 0 ? (
                        <div className="desktop-dash-summary-row">
                            <div
                                className="desktop-dash-summary-cell"
                                style={{ width: "100%" }}
                            >
                                {t("firstplacenoaccepts")}
                            </div>
                        </div>
                    ) : (
                        teamsAbove.map((team, index) => {
                            const accept = summary.accept.includes(team.number);
                            const reject = summary.reject.includes(team.number);

                            const handleAccept = () => {
                                if (accept) {
                                    updateSummary({
                                        accept: summary.accept.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                } else {
                                    updateSummary({
                                        accept: [
                                            ...summary.accept,
                                            team.number,
                                        ],
                                        reject: summary.reject.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                }
                            };

                            const handleReject = () => {
                                if (reject) {
                                    updateSummary({
                                        reject: summary.reject.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                } else {
                                    updateSummary({
                                        reject: [
                                            ...summary.reject,
                                            team.number,
                                        ],
                                        accept: summary.accept.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                }
                            };

                            return (
                                <div
                                    className={`desktop-dash-summary-row ${
                                        accept
                                            ? "summary-accept"
                                            : reject
                                              ? "summary-reject"
                                              : ""
                                    }`}
                                    key={team.number}
                                >
                                    <div
                                        className="desktop-dash-summary-cell"
                                        style={{ width: "10%" }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={accept}
                                            onChange={handleAccept}
                                            className="desktop-dash-prescout-team-checkbox"
                                        />
                                    </div>
                                    <div
                                        className="desktop-dash-summary-cell"
                                        style={{ width: "10%" }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={reject}
                                            onChange={handleReject}
                                            className="desktop-dash-prescout-team-checkbox"
                                        />
                                    </div>
                                    <div
                                        className="desktop-dash-summary-cell"
                                        style={{ width: "80%" }}
                                    >
                                        {team.number} - {team.name}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    className="phone-dash-summary-table"
                    style={{ width: "130vw" }}
                >
                    <div
                        className="phone-dash-summary-row"
                        style={{ position: "sticky", top: 0 }}
                    >
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("accept")}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "15%" }}
                        >
                            {t("reject")}
                        </div>
                        <div
                            className="phone-dash-summary-cell"
                            style={{ width: "70%" }}
                        >
                            {t("team")}
                        </div>
                    </div>

                    {teamsAbove.length === 0 ? (
                        <div className="phone-dash-summary-row">
                            <div
                                className="phone-dash-summary-cell"
                                style={{ width: "100%" }}
                            >
                                {t("firstplacenoaccepts")}
                            </div>
                        </div>
                    ) : (
                        teamsAbove.map((team, index) => {
                            const accept = summary.accept.includes(team.number);
                            const reject = summary.reject.includes(team.number);

                            const handleAccept = () => {
                                if (accept) {
                                    updateSummary({
                                        accept: summary.accept.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                } else {
                                    updateSummary({
                                        accept: [
                                            ...summary.accept,
                                            team.number,
                                        ],
                                        reject: summary.reject.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                }
                            };

                            const handleReject = () => {
                                if (reject) {
                                    updateSummary({
                                        reject: summary.reject.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                } else {
                                    updateSummary({
                                        reject: [
                                            ...summary.reject,
                                            team.number,
                                        ],
                                        accept: summary.accept.filter(
                                            (number) => number !== team.number,
                                        ),
                                    });
                                }
                            };

                            return (
                                <div
                                    className={`phone-dash-summary-row ${
                                        accept
                                            ? "summary-accept"
                                            : reject
                                              ? "summary-reject"
                                              : ""
                                    }`}
                                    key={team.number}
                                >
                                    <div
                                        className="phone-dash-summary-cell"
                                        style={{ width: "15%" }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={accept}
                                            onChange={handleAccept}
                                            className="phone-dash-prescout-team-checkbox"
                                        />
                                    </div>
                                    <div
                                        className="phone-dash-summary-cell"
                                        style={{ width: "15%" }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={reject}
                                            onChange={handleReject}
                                            className="phone-dash-prescout-team-checkbox"
                                        />
                                    </div>
                                    <div
                                        className="phone-dash-summary-cell"
                                        style={{ width: "70%" }}
                                    >
                                        {team.number} - {team.name}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </>
        );
    }
}
