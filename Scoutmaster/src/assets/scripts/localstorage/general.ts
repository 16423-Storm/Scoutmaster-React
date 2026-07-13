import type { MatchData } from "./matches";
import type { PrescoutData } from "./teams";
import { useCustom } from "./competitions";
import { useTeams } from "./teams";
import { useMatches } from "./matches";

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
 * Resets all states (teams, custom, etc)
 */
export function resetAllStates() {
    useCustom.getState().setCustom(false);
    useTeams.getState().setTeams({});
    useMatches.getState().setMatches({});
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
    resetAllStates();
}

/**
 * Hydrates local storage with data from database
 */
export function hydrate() {}
