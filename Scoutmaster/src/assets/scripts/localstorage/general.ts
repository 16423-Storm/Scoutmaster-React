import type { MatchData } from "./matches";
import type { PrescoutData } from "./prescout";
import type { SummaryData } from "./summary";
import { useCustom } from "./competitions";
import { useTeams } from "./teams";
import { useMatches } from "./matches";

export type LocalStorageData = {
    compkey: string;
    custom: boolean;
    team: string;
    prescout: PrescoutData;
    match: MatchData;
    summary: SummaryData;
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
    const existing = localStorage.getItem("data");

    if (existing && !force) {
        return;
    }

    let setPrescout = {
        structure: {},
        sections: {
            "0": {
                title: "Section 1",
                headersize: 1,
                questions: [],
                index: 0,
            },
        },
    };

    let currentTeam = "0";

    if (existing) {
        const parsed = JSON.parse(existing);

        currentTeam = parsed.team;

        setPrescout.structure = parsed.prescout.structure;
        setPrescout.sections = parsed.prescout.sections;
    }

    const skeleton: LocalStorageData = {
        compkey: "",
        custom: false,
        team: currentTeam,
        prescout: {
            structure: setPrescout.structure,
            sections: setPrescout.sections,
            teams: {},
        },
        match: {},
        summary: {
            picks: [],
            accept: [],
            reject: [],
            pos: 1,
        },
    };

    localStorage.setItem("data", JSON.stringify(skeleton));
    resetAllStates();
}

/**
 * Hydrates local storage with data from database
 */
export function hydrate() {}
