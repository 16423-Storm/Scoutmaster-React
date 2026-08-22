import i18n from "../localization";
import { successToast, errorToast, infoToast } from "../misc/toastmanager";
import { create } from "zustand";
import { nanoid } from "nanoid";

import { setCustom } from "./competitions";
import { sendMessage } from "../serverutils/realtime";

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
 * @param {boolean} [show = true] - Whether or not success/error toasts will be shown, true by default
 * @param {boolean} sendServer - Send data to server for update, true by default
 * @param {boolean} infoShow - Show info popup when someone else makes a change, false by default
 */
export async function addMatch(
    red1: number,
    red2: number,
    blue1: number,
    blue2: number,
    custom: boolean = false,
    show: boolean = true,
    sendServer: boolean = true,
    infoShow: boolean = false,
) {
    const matches = getMatches();
    let key = 1;
    while (Object.hasOwn(matches, key)) {
        key++;
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

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "addMatch",
                content: {
                    red1: red1,
                    red2: red2,
                    blue1: blue1,
                    blue2: blue2,
                    key: key,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
        if (custom) {
            setCustom(true, false, sendServer, infoShow);
        }

        if (show) {
            successToast(i18n.t("matchadded"), 2000);
        }

        if (infoShow) {
            infoToast(i18n.t("matchaddedinfo"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not add match: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export async function addMatches(
    matches: {
        red1: number;
        red2: number;
        blue1: number;
        blue2: number;
        key: number;
    }[],
    sendServer: boolean = true,
) {
    const data = localStorage.getItem("data");

    if (!data) {
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        for (const match of matches) {
            const teams = [match.red1, match.red2, match.blue1, match.blue2];

            parsed.match[match.key.toString()] = {
                teams,
                red1: match.red1,
                red2: match.red2,
                blue1: match.blue1,
                blue2: match.blue2,
                scores: [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                ],
            };
        }

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "addMatches",
                content: matches,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
    } catch (e) {
        console.error("ERROR: Could not add teams:", e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

/**
 * Updates a score in a match
 * @param {string} matchId - The ID of the match
 * @param {number} allianceIndex - The alliance station (0 = Red1, 1 = Red2, 2 = Blue1, 3 = Blue2)
 * @param {number} questionIndex - The index of the question
 * @param {number} value - The new score to set
 * @param {boolean} counter - Whether this is a counter or an exact number
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function updateScore(
    matchId: string,
    allianceIndex: number,
    questionIndex: number,
    value: number,
    counter: boolean,
    sendServer: boolean = true,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        const originalParsed = JSON.parse(data);
        const score =
            parsed.match[matchId].scores[allianceIndex][questionIndex];
        if (score === undefined) {
            console.error("ERROR: Score does not exist");
            return;
        }

        if (counter) {
            if (value == 1) {
                parsed.match[matchId].scores[allianceIndex][questionIndex] += 1;
            } else {
                if (
                    parsed.match[matchId].scores[allianceIndex][questionIndex] >
                    0
                ) {
                    parsed.match[matchId].scores[allianceIndex][
                        questionIndex
                    ] -= 1;
                }
            }
        } else {
            parsed.match[matchId].scores[allianceIndex][questionIndex] = value;
        }

        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "updateScore",
                // k = key, a = alliance index, a = alliance, q = question index, v = value, c = counter
                // this is only because updateScore will be called so often that I need to lower the data sent back and forth as much as possible
                content: {
                    k: matchId,
                    a: allianceIndex,
                    q: questionIndex,
                    v: value,
                    c: counter,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                localStorage.setItem("data", JSON.stringify(originalParsed));
                useMatches.getState().setMatches(getMatches());
                return;
            }
        }
    } catch (e) {
        console.error("ERROR: Could not update score: " + e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

/**
 *
 * @param {number} num - Target match number to delete
 * @param {boolean} custom - Whether to set competition to custom or not
 * @param {boolean} show - Show success toasts or not, true by default
 * @param {boolean} sendServer - Send data to server for update, true by default
 * @param {boolean} infoShow - Show message saying someone else deleted match, false by default
 */
export async function deleteMatch(
    num: string,
    custom: boolean,
    show: boolean = true,
    sendServer: boolean = true,
    infoShow: boolean = false,
) {
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

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteMatch",
                content: {
                    key: num,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        delete parsed.match[num];
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());

        if (custom) {
            setCustom(true, false, sendServer);
        }

        if (show) {
            successToast(i18n.t("matchdeleted"), 2000);
        }

        if (infoShow) {
            infoToast(i18n.t("matchaddedinfo"), 2000);
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

export async function initMatchesAPI(eventCode: string, sendServer: boolean) {
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

        const modifiedMatches = [];

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

                modifiedMatches.push({
                    red1: teams.RedOne,
                    red2: teams.RedTwo,
                    blue1: teams.BlueOne,
                    blue2: teams.BlueTwo,
                    key: entry.matchNum,
                });
            }
        }

        await addMatches(modifiedMatches, sendServer);
    } catch (error) {
        console.error("ERROR: Could not load teams: ", error);
        errorToast(i18n.t("dataloaderror"), 3000);
    }
}
