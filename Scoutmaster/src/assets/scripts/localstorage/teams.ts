import i18n from "../localization";
import { successToast, errorToast } from "../misc/toastmanager";
import { create } from "zustand";

import { setCustom } from "./competitions";

type Team = {
    name: string;
    data: (string | number | boolean)[];
    matchesIn: number[];
};

type Teams = {
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
 * @param {boolean} [custom = false] - Whether to set competition to custom or not, false by default
 */
export function addTeam(num: number, name: string, custom = false) {
    if (Object.hasOwn(getTeams(), num.toString())) {
        console.error("ERROR: Attempted to add duplicate team");
        errorToast("Team already added", 3000);
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
            data: [],
            matchesIn: [],
        };
        localStorage.setItem("data", JSON.stringify(parsed));
        useTeams.getState().setTeams(getTeams());
        successToast(i18n.t("teamadded"), 2000);
        if (custom) {
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
        console.error("ERROR: Could not add team: " + e);
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
 * Hydrates local storage with data from database
 */
export function hydrate() {}

// PRESCOUT MANAGEMENT
//
//
//
//
//
//
//
//
//
//
//
// PRESCOUT MANAGEMENT

export type PrescoutData = {
    structure: {
        numOfQuestions: number;
        questionOrder: string[];
    };
    teams: {
        [teamId: string]: Team;
    };
};

/**
 * Returns an array of all teams being prescouted
 * @returns
 */
export function loadPrescoutTeams() {}

/**
 * Returns that team's prescouting data
 * @param {string} team - The specific team number to load data from
 * @returns e
 */
export function loadTeamData(team: string) {
    if (!/^\d+$/.test(team)) {
        console.error("ERROR: Team must be a numeric string");
    }
}

export function addDataToTeam() {}

export function resetTeam() {}
