import i18n from "../localization";
import { successToast, errorToast } from "../misc/toastmanager";
import { create } from "zustand";

import { setCustom } from "./competitions";

export type MatchData = {
    [matchNum: string]: {
        teams: number[];
        red1: number;
        red2: number;
        blue1: number;
        blue2: number;
        scores: number[][];
    };
};

// Scores will use the following index: !!! NOTE, THESE ARE FOR DECODE, NOT BIOBUZZ, WILL BE UPDATED WHEN SEASON STARTS !!!
// - Auto classified
// - Auto overflow
// - Auto pattern
// - Auto leave

// - Teleop classified
// - Teleop overflow
// - Teleop pattern
// - Teleop base

export type Match = {
    teams: number[];
    red1: number;
    red2: number;
    blue1: number;
    blue2: number;
    scores: number[][];
};

type Matches = {
    [matchId: string]: Match;
};

/**
 * Returns the current listed matches from localstorage if available
 * @returns {Matches} teams
 */
export function getMatches() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }

    try {
        const matches = JSON.parse(data).match as Matches;
        return Object.fromEntries(
            Object.entries(matches).sort(([a], [b]) => Number(a) - Number(b)),
        );
    } catch (e) {
        console.error(`ERROR: Could not get matches: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Add match to competition
 * @param {number} key - Match Number
 * @param {number} red1 - Team for red 1
 * @param {number} red2 - Team for red 2
 * @param {number} blue1 - Team for blue 1
 * @param {number} blue2 - Team for blue 2
 */
export function addMatch(
    red1: number,
    red2: number,
    blue1: number,
    blue2: number,
    custom: boolean = false,
    key: number | null = null,
) {
    const matches = getMatches();
    if (key != null) {
        if (Object.hasOwn(matches, key)) {
            console.error("ERROR: Attempted to add duplicate match");
            if (custom) {
                errorToast("Match already added", 3000);
            }
            return;
        }
    } else {
        key = 1;
        while (Object.hasOwn(matches, key)) {
            key++;
        }
    }

    const teams = [red1, red2, blue1, blue2];

    if (teams.length !== 4) {
        console.error(
            "Not all team slots filled, if needed, set empty slots to negative numbers to prevent confusion",
        );
        errorToast(i18n.t("matchnotenoughteams"), 3000);
        return;
    }

    if (new Set(teams).size !== 4) {
        console.error("Duplicate teams added");
        errorToast(i18n.t("matchduplicateteams"), 3000);
        return;
    }

    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        parsed.match[key.toString()] = {
            teams,
            red1,
            red2,
            blue1,
            blue2,
            scores: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
        };
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
        if (custom) {
            successToast(i18n.t("matchadded"), 2000);
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not add match: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Updates a score in a match
 * @param {string} matchId - The ID of the match
 * @param {number} allianceIndex - The alliance station (0 = Red1, 1 = Red2, 2 = Blue1, 3 = Blue2)
 * @param {number} questionIndex - The index of the question
 * @param {number} value - The new score to set
 */
export function updateScore(
    matchId: string,
    allianceIndex: number,
    questionIndex: number,
    value: number,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        const score =
            parsed.match[matchId].scores[allianceIndex][questionIndex];
        if (score === undefined) {
            console.error("ERROR: Score does not exist");
            return;
        }
        parsed.match[matchId].scores[allianceIndex][questionIndex] = value;
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
    } catch (e) {
        console.error("ERROR: Could not update score: " + e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

export function deleteMatch(num: string, custom: boolean) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        if (!parsed.match[num]) {
            console.warn("WARNING: Match does not exist");
        }
        delete parsed.match[num];
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
        successToast(i18n.t("matchdeleted"), 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not delete team: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useMatches = create<{
    matches: Matches;
    setMatches: (value: Matches) => void;
}>((set) => ({
    matches: getMatches(),
    setMatches: (value) => set({ matches: value }),
}));

export async function initMatchesAPI(eventCode: string) {
    const query = `
        query ExampleQuery($season: Int!, $code: String!) {
            eventByCode(season: $season, code: $code) {
                    matches {
                        matchNum
                        tournamentLevel
                            teams {
                                teamNumber
                                station
                                alliance
                            }
                        }
                }
            }
    `;

    const variables = {
        season: 2025,
        code: eventCode,
    };

    try {
        const response = await fetch("https://api.ftcscout.org/graphql", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error("GraphQL errors:", result.errors);
            errorToast(i18n.t("dataloaderror"), 3000);
            return;
        }

        const matches = result.data?.eventByCode?.matches;

        if (!matches) {
            console.error("ERROR: No matches returned from GraphQL");
            errorToast(i18n.t("dataloaderror"), 3000);
            return;
        }

        for (const entry of matches) {
            if (entry?.tournamentLevel == "Quals") {
                const teams = Object.fromEntries(
                    entry.teams.map(
                        (team: {
                            teamNumber: number;
                            station: string;
                            alliance: string;
                        }) => [
                            `${team.alliance}${team.station}`,
                            team.teamNumber,
                        ],
                    ),
                );

                const redOne = teams.RedOne;
                const redTwo = teams.RedTwo;
                const blueOne = teams.BlueOne;
                const blueTwo = teams.BlueTwo;

                addMatch(
                    redOne,
                    redTwo,
                    blueOne,
                    blueTwo,
                    false,
                    entry.matchNum,
                );
            }
        }
    } catch (error) {
        console.error("ERROR: Could not load teams: ", error);
        errorToast(i18n.t("dataloaderror"), 3000);
    }
}
