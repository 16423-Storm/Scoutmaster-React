import { getNumberOfMembers } from "./auth";
import { create } from "zustand";
import { successToast, errorToast } from "./misc/toastmanager";

import i18n from "./localization";

// GENERAL LOCAL STORAGE MANAGEMENT
export type LocalStorageData = {
    compkey: string;
    custom: boolean;
    prescout: PrescoutData;
    match: MatchData;
};

/**
 * Clears localstorage
 */
export function clearLocalStorage() {
    localStorage.clear();
}

/**
 * Manages initialization of all data related to dashboard
 */
export function dashboardStart() {
    return;
}

/**
 * Creates the base skeleton structure for localstorage
 *
 * @param {boolean} force - Force overwrite of existing localstorage or not
 */
export function createSkeleton(force: boolean) {
    if (localStorage.length != 0) {
        if (force) {
            clearLocalStorage();
        } else {
            return;
        }
    }
    const skeleton: LocalStorageData = {
        compkey: "",
        custom: false,
        prescout: {
            structure: {
                numOfQuestions: 0,
                questionOrder: [],
            },
            teams: {},
        },
        match: {},
    };

    localStorage.setItem("data", JSON.stringify(skeleton));
    useCustom.getState().setCustom(false);
}

/**
 * Returns the current competition key from localstorage if available, "NONE" if not
 * @returns {string} competition key or "NONE"
 */
export function getCompKey() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return "NONE";
    }

    try {
        return JSON.parse(data).compkey;
    } catch (e) {
        console.error(`ERROR: Failed to get competition key: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return "NONE";
    }
}

/**
 * Overwrites competition key
 * @param {string} compkey - Competition Key
 */
export function setCompKey(compkey: string) {
    createSkeleton(true);
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        parsed.compkey = compkey;
        localStorage.setItem("data", JSON.stringify(parsed));
        useCompKey.getState().setCompKey(compkey);
        successToast(i18n.t("compsuccess"), 2000);
    } catch (e) {
        console.error("ERROR: Failed to set competition: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useCompKey = create<{
    compKey: string;
    setCompKey: (value: string) => void;
}>((set) => ({
    compKey: getCompKey(),

    setCompKey: (value) => set({ compKey: value }),
}));

/**
 * Returns the current custom status from localstorage if available
 * @returns {boolean} custom
 */
export function getCustom() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return false;
    }

    try {
        return JSON.parse(data).custom;
    } catch (e) {
        console.error(`ERROR: Could not get custom: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return false;
    }
}

/**
 * Switches current competition to a custom one
 */
export function setCustom(custom: boolean) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        parsed.custom = custom;
        localStorage.setItem("data", JSON.stringify(parsed));
        useCustom.getState().setCustom(custom);
        successToast(i18n.t("customsuccess"), 2000);
    } catch (e) {
        console.error("ERROR: Could not set competition to custom: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useCustom = create<{
    isCustom: boolean;
    setCustom: (value: boolean) => void;
}>((set) => ({
    isCustom: getCustom(),

    setCustom: (value) => set({ isCustom: value }),
}));

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
        return JSON.parse(data).prescout.teams as Teams;
    } catch (e) {
        console.error(`ERROR: Could not get teams: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

export function addTeam(num: number, name: string) {
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
        successToast("Team successfully added", 2000);
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

// MATCH MANAGEMENT
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
// MATCH MANAGEMENT

export type MatchData = {
    [matchNum: string]: {
        highlighted: boolean[];
        teams: number[];
        red1: number[];
        red2: number[];
        blue1: number[];
        blue2: number[];
    };
};
