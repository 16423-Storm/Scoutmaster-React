import i18n from "../localization";
import { successToast, errorToast } from "../misc/toastmanager";
import { create } from "zustand";

import { setCustom } from "./competitions";

import { getCountryCode } from "countries-list";

export type Team = {
    name: string;
    data: {
        [key: string]:
            | string
            | number
            | boolean
            | string[]
            | number[]
            | boolean[];
    };
    code?: string;
};

export type Teams = {
    [teamId: string]: Team;
};

/**
 * Returns the current listed teams from localstorage if available
 * @returns {Teams} teams
 */
export function getTeams() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }

    try {
        const teams = JSON.parse(data).prescout.teams as Teams;
        return Object.fromEntries(
            Object.entries(teams).sort(([a], [b]) => Number(a) - Number(b)),
        );
    } catch (e) {
        console.error(`ERROR: Could not get teams: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Add team to competition
 * @param {number} num - Team number
 * @param {string} name - Team name
 * @param {string} code - Team country code (optional)
 * @param {boolean} [custom = false] - Whether to set competition to custom or not, false by default
 */
export function addTeam(
    num: number,
    name: string,
    custom = false,
    code?: string,
) {
    if (Object.hasOwn(getTeams(), num.toString())) {
        console.error("ERROR: Attempted to add duplicate team");
        errorToast(i18n.t("teamduplicate"), 3000);
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
        parsed.prescout.teams[num.toString()] = {
            name: name,
            data: {},
            ...(code ? { code: code } : {}),
        };
        localStorage.setItem("data", JSON.stringify(parsed));
        useTeams.getState().setTeams(getTeams());
        if (custom) {
            successToast(i18n.t("teamadded"), 2000);
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not add team: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export function deleteTeam(num: string, custom: boolean) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        if (!parsed.prescout.teams[num]) {
            console.warn("WARNING: Team does not exist");
        }
        delete parsed.prescout.teams[num];
        localStorage.setItem("data", JSON.stringify(parsed));
        useTeams.getState().setTeams(getTeams());
        successToast(i18n.t("teamdeleted"), 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not delete team: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useTeams = create<{
    teams: Teams;
    setTeams: (value: Teams) => void;
}>((set) => ({
    teams: getTeams(),
    setTeams: (value) => set({ teams: value }),
}));

/**
 * Update a team's answer for a specific question.
 * @param {string} teamId - Team ID
 * @param {string} questionId - Question ID
 * @param {string | number | boolean | string[] | number[] | boolean[] | undefined} value - Answer value
 * @param {boolean} show - Whether to show success toasts or not (Default false)
 */
export function updateTeamQuestion(
    teamId: string,
    questionId: string,
    value:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | undefined,
    show: boolean = false,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        const team = parsed.prescout.teams[teamId];
        if (!team) {
            console.error("ERROR: Team does not exist");
            return;
        }
        if (value === undefined) {
            delete team.data[questionId];
        } else {
            team.data[questionId] = value;
        }
        localStorage.setItem("data", JSON.stringify(parsed));
        useTeams.getState().setTeams(getTeams());
        if (show) {
            successToast(i18n.t("teamupdated"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not update team question: " + e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

export async function initTeamsAPI(eventCode: string) {
    const query = `
        query ExampleQuery($season: Int!, $code: String!) {
            eventByCode(season: $season, code: $code) {
                teams {
                    team {
                        number
                        name
                        location {
                            country
                        }
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

        const teams = result.data?.eventByCode?.teams;

        if (!teams) {
            console.error("ERROR: No teams returned from GraphQL");
            errorToast(i18n.t("dataloaderror"), 3000);
            return;
        }

        for (const entry of teams) {
            const team = entry.team;

            if (!team) continue;

            addTeam(
                team.number,
                team.name,
                false,
                getCountryCode(team.location?.country) || undefined,
            );
        }
    } catch (error) {
        console.error("ERROR: Could not load teams: ", error);
        errorToast(i18n.t("dataloaderror"), 3000);
    }
}
