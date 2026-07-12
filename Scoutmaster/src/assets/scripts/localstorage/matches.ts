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
    };
};

type Match = {
    teams: number[];
    red1: number;
    red2: number;
    blue1: number;
    blue2: number;
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
        const matches = JSON.parse(data).matchscout as Matches;
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
    key: string,
    red1: number,
    red2: number,
    blue1: number,
    blue2: number,
    custom = false,
) {
    if (Object.hasOwn(getMatches(), key)) {
        console.error("ERROR: Attempted to add duplicate match");
        errorToast("Match already added", 3000);
        return;
    }

    const teams = [red1, red2, blue1, blue2];

    if (teams.length !== 4) {
        console.error(
            "Not all team slots filled, if needed, set empty slots to negative numbers to prevent confusion",
        );
        errorToast(
            "Not all team slots filled, if needed, fill with negative numbers",
            3000,
        );
        return;
    }

    if (new Set(teams).size !== 4) {
        console.error("Duplicate teams added");
        errorToast("Duplicate teams added", 3000);
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
        parsed.matchscout[key.toString()] = {};
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
        successToast("Successfully added match", 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not add match: " + e);
        errorToast("Could not add match", 3000);
        return;
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
        if (!parsed.matchscout[num]) {
            console.warn("WARNING: Match does not exist");
        }
        delete parsed.matchscout[num];
        localStorage.setItem("data", JSON.stringify(parsed));
        useMatches.getState().setMatches(getMatches());
        successToast("Successfully deleted match", 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not delete team: " + e);
        errorToast("Could not delete match", 3000);
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
