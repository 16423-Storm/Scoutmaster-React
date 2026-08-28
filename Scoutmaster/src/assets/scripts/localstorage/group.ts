import i18n from "../localization";
import { successToast, errorToast, infoToast } from "../misc/toastmanager";
import { create } from "zustand";
import { nanoid } from "nanoid";

import { sendMessage } from "../serverutils/realtime";

// id: number
// "members": {},
// "invited": [],
// "groupsettings": {"stc": false}

export function getMembers() {
    const data = localStorage.getItem("group");
    if (!data) {
        console.error(`ERROR: Could not get item "group" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {
            id: "",
            email: "",
            isAdmin: false,
        };
    }

    try {
        const members = JSON.parse(data).members;
        return members;
    } catch (e) {
        console.error(`ERROR: Could not get members: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {
            id: "",
            email: "",
            isAdmin: false,
        };
    }
}

export async function addMember(
    member: { id: string; email: string; isAdmin: boolean },
    show: boolean = false,
    infoShow: boolean = false,
) {
    const data = localStorage.getItem("group");

    if (!data) {
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        parsed.members.push(member);

        localStorage.setItem("group", JSON.stringify(parsed));
        useMembers.getState().setMembers(getMembers());
    } catch (e) {
        console.error("ERROR: Could not add member:", e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

export async function deleteMember(
    email: string,
    sendServer: boolean = true,
    show: boolean = false,
    infoShow: boolean = false,
) {
    const data = localStorage.getItem("group");

    if (!data) {
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        parsed.members = parsed.members.filter(
            (member: { id: string; email: string; isAdmin: boolean }) =>
                member.email !== email,
        );

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteMember",
                content: parsed.members,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("group", JSON.stringify(parsed));
        useMembers.getState().setMembers(getMembers());
    } catch (e) {
        console.error("ERROR: Could not delete member:", e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

export const useMembers = create<{
    members: {
        id: string;
        email: string;
        isAdmin: boolean;
    }[];
    setMembers: (
        value: {
            id: string;
            email: string;
            isAdmin: boolean;
        }[],
    ) => void;
}>((set) => ({
    members: getMembers(),
    setMembers: (value) => set({ members: value }),
}));

export function getInvited() {
    const data = localStorage.getItem("group");
    if (!data) {
        console.error(`ERROR: Could not get item "group" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return [];
    }

    try {
        const invited = JSON.parse(data).invited as string[];
        return invited;
    } catch (e) {
        console.error(`ERROR: Could not get invited: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return [];
    }
}

/**
 *
 * @param {string[]} invited
 * @param {boolean} sendServer
 * @param {boolean} show
 * @param {boolean} infoShow
 * @returns
 */
export async function updateInvited(
    invited: string[],
    sendServer: boolean = true,
    show: boolean = false,
    infoShow: boolean = false,
) {
    const data = localStorage.getItem("group");

    if (!data) {
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        parsed.invited = invited;

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "updateInvited",
                content: invited,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("group", JSON.stringify(parsed));
        useInvited.getState().setInvited(getInvited());
    } catch (e) {
        console.error("ERROR: Could not update invited:", e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

export const useInvited = create<{
    invited: string[];
    setInvited: (value: string[]) => void;
}>((set) => ({
    invited: getInvited(),
    setInvited: (value) => set({ invited: value }),
}));

export async function getGroupSettings() {}

export async function updateGroupSettings() {}
