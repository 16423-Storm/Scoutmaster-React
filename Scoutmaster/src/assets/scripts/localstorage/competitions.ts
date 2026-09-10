import i18n from "../localization";
import { successToast, errorToast, infoToast } from "../misc/toastmanager";
import { create } from "zustand";
import { nanoid } from "nanoid";

import { initTeamsAPI } from "./teams";
import { initMatchesAPI } from "./matches";

import { createSkeleton } from "./general";

import { sendMessage } from "../serverutils/realtime";

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
 * @param {boolean} [show = true] - Whether or not success/error toasts will be shown, true by default
 * @param {boolean} sendServer - Send data to server for update, true by default
 * @param {boolean} infoShow - Show info popup when someone else makes a change, false by default
 */
export async function setCompKey(
    compkey: string,
    show = true,
    sendServer: boolean = true,
    infoShow = false,
) {
    try {
        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "compCodeChange",
                content: compkey,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }
        createSkeleton(true);

        const data = localStorage.getItem("data");
        if (!data) {
            console.error(`ERROR: Could not get item "data" from localstorage`);
            errorToast(i18n.t("dataloaderror"), 3000);
            return;
        }

        const parsed = JSON.parse(data);
        parsed.compkey = compkey;

        localStorage.setItem("data", JSON.stringify(parsed));
        useCompKey.getState().setCompKey(compkey);

        if (sendServer) {
            initTeamsAPI(compkey, sendServer);
            initMatchesAPI(compkey, sendServer);
        }

        if (show) {
            successToast(i18n.t("compsuccess"), 2000);
        }

        if (infoShow) {
            infoToast(i18n.t("compinfoshow"), 2000);
        }
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
 * Sets status of competition being custom
 *
 * @param {boolean} custom - What to set custom to
 * @param {boolean} [show = true] - Whether or not success/error toasts will be shown, true by default
 * @param {boolean} sendServer - Send data to server for update, true by default
 * @param {boolean} infoShow - Show info popup when someone else makes a change, false by default
 */
export async function setCustom(
    custom: boolean,
    show = true,
    sendServer: boolean = true,
    infoShow = false,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        if (show) {
            errorToast(i18n.t("dataloaderror"), 3000);
        }
        return;
    }

    try {
        const parsed = JSON.parse(data);
        const oldCustom = JSON.parse(data).custom;
        parsed.custom = custom;

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "custom",
                content: custom,
                requestId,
            });

            if (!confirmed) {
                if (show) {
                    errorToast(i18n.t("seterror"), 3000);
                }

                return;
            }
        }

        localStorage.setItem("data", JSON.stringify(parsed));
        useCustom.getState().setCustom(custom);

        if (show) {
            successToast(i18n.t("customsuccess"), 2000);
        }

        if (infoShow && oldCustom != custom) {
            infoToast(i18n.t("custominfoshow"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not set competition to custom: " + e);
        if (show) {
            errorToast(i18n.t("seterror"), 3000);
        }
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

export type Competition = {
    name: string;
    key: string;
};

const competitionSearchCache = new Map<string, Competition[]>();

export async function searchCompetitions(
    season: number,
    searchText: string,
    currentKey: string,
): Promise<Competition[]> {
    const search = searchText.trim();

    if (!search) {
        return [];
    }

    const cacheKey = `${season}:${search.toLowerCase()}`;

    const cached = competitionSearchCache.get(cacheKey);

    if (cached) {
        return cached.filter((event) => event.key !== currentKey);
    }

    try {
        const params = new URLSearchParams({
            searchText: search,
        });

        const response = await fetch(
            `https://api.ftcscout.org/rest/v1/events/search/${season}?${params}`,
        );

        if (!response.ok) {
            console.error(
                "FTCScout API error:",
                response.status,
                await response.text(),
            );
            return [];
        }

        const events = await response.json();

        const competitions: Competition[] = events
            .slice(0, 12)
            .map((event: { name: string; code: string }) => ({
                name: event.name,
                key: event.code,
            }));

        competitionSearchCache.set(cacheKey, competitions);

        return competitions.filter((event) => event.key !== currentKey);
    } catch (error) {
        console.error("ERROR: Could not search competitions:", error);
        return [];
    }
}
