import type { MatchData } from "./matches";
import type { PrescoutData } from "./prescout";
import type { SummaryData } from "./summary";
import { useCustom, getCustom } from "./competitions";
import { useTeams, getTeams } from "./teams";
import { useMatches, getMatches } from "./matches";
import { useGroupTeam, useSummary, getGroupTeam, getSummary } from "./summary";

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
    useSummary
        .getState()
        .setSummary({ picks: [], accept: [], reject: [], pos: 0 });
}

/**
 * Refreshes states (sets all states to their getState() instead of just setting to default)
 */
export function refreshAllStates() {
    useCustom.getState().setCustom(getCustom());
    useTeams.getState().setTeams(getTeams());
    useMatches.getState().setMatches(getMatches());
    useSummary.getState().setSummary(getSummary());
    useGroupTeam.getState().setGroupTeam(getGroupTeam());
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
export function hydrate(
    compkey: string,
    custom: boolean,
    team: string,
    prescout: PrescoutData | null,
    match: MatchData | null,
    summary: SummaryData | null,
) {
    const skeleton: LocalStorageData = {
        compkey: compkey ?? "",
        custom: custom ?? false,
        team: team ?? "0",

        prescout: prescout ?? {
            structure: {},
            sections: {},
            teams: {},
        },

        match: match ?? {},

        summary: summary ?? {
            picks: [],
            accept: [],
            reject: [],
            pos: 0,
        },
    };

    localStorage.setItem("data", JSON.stringify(skeleton));

    refreshAllStates();
}
