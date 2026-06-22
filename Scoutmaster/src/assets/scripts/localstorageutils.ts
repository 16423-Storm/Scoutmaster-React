import { getNumberOfMembers } from "./auth";

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
    if (getNumberOfMembers() == 1) {
        createSkeleton(false);
    }
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
}

/**
 * Returns the current competition key if available, "NONE" if not
 * @returns {string} competition key or "NONE"
 */
export function getCompKey() {
    const data = localStorage.getItem("data");
    if (!data) {
        return "NONE";
    }

    try {
        return JSON.parse(data).compkey;
    } catch {
        return "NONE";
    }
}

/**
 * Overwrites competition key
 * @param {string} compkey - Competition Key
 */
export function setCompKey(compkey: string) {
    const data = localStorage.getItem("data");
    if (!data) {
        return;
    }

    try {
        const parsed = JSON.parse(data);
        parsed.compkey = compkey;
        localStorage.setItem("data", JSON.parse(parsed));
    } catch {
        return;
    }
}

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
        [teamId: string]: {
            data?: any[];
            matchesIn?: number[];
        };
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
        throw new TypeError("team must be a numeric string");
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
