import type { Team } from "./teams";
import { successToast, errorToast } from "../misc/toastmanager";
import i18n from "../localization";
import { create } from "zustand";
import { setCustom } from "./competitions";

export type PrescoutData = {
    structure: { [questionId: string]: Question };
    sections: { [sectionId: string]: QuestionSection };
    teams: {
        [teamId: string]: Team;
    };
};

export type Question =
    | {
          type: "ln" | "sn" | "cb" | "a" | "img" | "n";
          title: string;
          section: number;
          index: number;
      }
    | {
          type: "mc" | "sc";
          title: string;
          opt: {
              [key: string]: string;
          };
          section: number;
          index: number;
      }
    | {
          type: "r";
          title: string;
          minmax: [number, number];
          jump: number;
          section: number;
          index: number;
      }
    | {
          type: "st";
          title: string;
          stars: number;
          section: number;
          index: number;
      };

export type QuestionSection = {
    title: string;
    headersize: 1 | 2 | 3;
};

type Questions = {
    [questionId: string]: Question;
};

/**
 * @returns {number} Number of questions
 */
export function getNumOfQuestions() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }

    try {
        const questionsAmount = JSON.parse(data).prescout.structure.length;
        return questionsAmount;
    } catch (e) {
        console.error(`ERROR: Could not get amount of questions: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Returns all current sections in prescouting data
 * @returns {QuestionSection[]} Sections
 */
export function getSections() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return [];
    }

    try {
        const sections = JSON.parse(data).prescout
            .sections as QuestionSection[];
        return sections;
    } catch (e) {
        console.error(`ERROR: Could not get sections: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Returns all current questions in prescouting data
 * @returns {Question[]} Sections
 */
export function getQuestions() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }

    try {
        const questions = JSON.parse(data).prescout.structure as Questions;
        return questions;
    } catch (e) {
        console.error(`ERROR: Could not get questions: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Add question to competition
 * @param {Question} question - Question
 */
export function addQuestion(question: Question, custom: boolean) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        const currentIds = Object.keys(parsed.prescout.structure).map(Number);
        let id = 0;
        while (currentIds.includes(id)) {
            id++;
        }

        parsed.prescout.structure[id.toString()] = question;

        localStorage.setItem("data", JSON.stringify(parsed));
        useQuestions.getState().setQuestions(getQuestions());
        successToast(i18n.t("teamadded"), 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not add team: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Delete question of choice
 * @param {string} id - Id of question to be deleted
 * @param {boolean} custom - whether to set competition to custom or not
 */
export function deleteQuestion(id: string, custom: boolean) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        if (!parsed.prescout.structure[id]) {
            console.warn("WARNING: Team does not exist");
        }
        delete parsed.prescout.structure[id];
        localStorage.setItem("data", JSON.stringify(parsed));
        useQuestions.getState().setQuestions(getQuestions());
        successToast(i18n.t("teamdeleted"), 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not delete question: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export function updateQuestion(
    id: string,
    changes: Partial<Question>,
    custom: boolean,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        const questionToEdit = parsed.prescout.structure[id];

        if (!questionToEdit) {
            console.error("ERROR: Question does not exist to edit");
            return;
        }

        parsed.prescout.structure[id] = {
            ...questionToEdit,
            ...changes,
        };

        localStorage.setItem("data", JSON.stringify(parsed));

        useQuestions.getState().setQuestions(getQuestions());

        successToast(i18n.t("teamdeleted"), 2000);
        if (custom) {
            setCustom(true, false);
        }
    } catch (e) {
        console.error("ERROR: Could not edit question: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useQuestions = create<{
    questions: Questions;
    setQuestions: (value: Questions) => void;
}>((set) => ({
    questions: getQuestions(),
    setQuestions: (value) => set({ questions: value }),
}));

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
