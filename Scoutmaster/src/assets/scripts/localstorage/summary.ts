import i18n from "../localization";
import { successToast, errorToast } from "../misc/toastmanager";
import { create } from "zustand";

import { getTeams } from "./teams";

export type SummaryData = {
    picks: string[];
    accept: string[];
    reject: string[];
    pos: number;
};

export function getSummary() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as SummaryData;
    }

    try {
        const summary = JSON.parse(data).summary as SummaryData;
        return summary;
    } catch (e) {
        console.error(`ERROR: Could not get summary: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as SummaryData;
    }
}

export function updateSummary(
    changes: Partial<SummaryData>,
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

        const summary = parsed.summary;

        parsed.summary = {
            ...summary,
            ...changes,
        };

        localStorage.setItem("data", JSON.stringify(parsed));

        useSummary.getState().setSummary(getSummary());

        if (sendServer) {
            console.log("SEND TO SERVER");
        }
    } catch (e) {
        console.error("ERROR: Could not edit summary: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Reorders scouting picks
 * @param {number} index - The current index of the item to move
 * @param {-1 | 1} dir - The direction to move
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export function movePicks(
    index: number,
    dir: -1 | 1,
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

        const targetIndex = index + dir;
        if (targetIndex < 0 || targetIndex >= parsed.summary.picks.length)
            return;

        [parsed.summary.picks[index], parsed.summary.picks[targetIndex]] = [
            parsed.summary.picks[targetIndex],
            parsed.summary.picks[index],
        ];

        localStorage.setItem("data", JSON.stringify(parsed));

        useSummary.getState().setSummary(getSummary());

        if (sendServer) {
            console.log("SEND TO SERVER");
        }
    } catch (e) {
        console.error("ERROR: Could not edit summary: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useSummary = create<{
    summary: SummaryData;
    setSummary: (value: SummaryData) => void;
}>((set) => ({
    summary: getSummary(),
    setSummary: (value) => set({ summary: value }),
}));

export function getGroupTeam() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return "";
    }

    try {
        const team = JSON.parse(data).team;
        return team;
    } catch (e) {
        console.error(`ERROR: Could not get team: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return "";
    }
}

export function updateGroupTeam(team: string, sendServer: boolean = true) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        parsed.team = team;

        localStorage.setItem("data", JSON.stringify(parsed));

        useGroupTeam.getState().setGroupTeam(getGroupTeam());

        if (sendServer) {
            console.log("SEND TO SERVER");
        }
    } catch (e) {
        console.error("ERROR: Could not edit group team: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useGroupTeam = create<{
    team: string;
    setGroupTeam: (value: string) => void;
}>((set) => ({
    team: getGroupTeam(),
    setGroupTeam: (value) => set({ team: value }),
}));

/**
 *
 * @param {boolean} allowZero - Whether to allow the function to return 0 or not, by default true
 * @returns {number} - Number of teams (if allowZero = false, then if there are 0 teams, it will return 1)
 */
export function getNumOfTeams(allowZero: boolean = true) {
    const length = Object.keys(getTeams()).length;

    if (length == 0 && !allowZero) {
        return 1;
    }

    return length;
}
