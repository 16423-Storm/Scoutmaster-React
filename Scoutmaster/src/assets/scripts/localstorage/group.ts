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

        const memberToDelete = parsed.members.find(
            (member: { id: string; email: string; isAdmin: boolean }) =>
                member.email === email,
        );

        if (!memberToDelete) {
            return;
        }

        parsed.members = parsed.members.filter(
            (member: { id: string; email: string; isAdmin: boolean }) =>
                member.email !== email,
        );

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteMember",
                content: memberToDelete.id,
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
 * @param {string} email
 * @param {boolean} sendServer
 * @param {boolean} show
 * @param {boolean} infoShow
 */
export async function addInvite(
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

        if (parsed.invited.length + parsed.members.length >= 32) {
            console.error("ERROR: Max members reached");
            errorToast(i18n.t("maxmemberserror"), 3000);
            return;
        }

        if (parsed.invited.includes(email)) {
            console.error("ERROR: Duplicate invite");
            errorToast(i18n.t("duplicateinvite"), 3000);
            return;
        }

        parsed.invited.push(email);

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "addInvite",
                content: email,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("group", JSON.stringify(parsed));
        useInvited.getState().setInvited(getInvited());

        if (show) {
            successToast(i18n.t("successinvite"), 2000);
        }

        if (infoShow) {
            infoToast(i18n.t("inviteinfoshow"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not update invited:", e);
        errorToast(i18n.t("seterror"), 3000);
    }
}

/**
 *
 * @param {string} email
 * @param {boolean} sendServer
 * @param {boolean} show
 * @param {boolean} infoShow
 */
export async function deleteInvite(
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

        parsed.invited = parsed.invited.filter(
            (notTarget: string) => notTarget !== email,
        );

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteInvite",
                content: email,
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("group", JSON.stringify(parsed));
        useInvited.getState().setInvited(getInvited());

        if (show) {
            successToast(i18n.t("successuninvite"), 2000);
        }

        if (infoShow) {
            infoToast(i18n.t("uninviteinfoshow"), 2000);
        }
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
