import type { Team, Teams } from "./teams";
import { successToast, errorToast } from "../misc/toastmanager";
import i18n from "../localization";
import { create } from "zustand";

export type PrescoutData = {
    structure: { [questionId: string]: Question };
    sections: { [sectionId: string]: QuestionSection };
    teams: {
        [teamId: string]: Team;
    };
};
import { useTeams, getTeams } from "./teams";

export type Question =
    | {
          type: "ln" | "sn" | "cb" | "a" | "img" | "n";
          title: string;
      }
    | {
          type: "mc" | "sc";
          title: string;
          opt: {
              [key: string]: string;
          };
      }
    | {
          type: "r";
          title: string;
          minmax: [number, number];
      }
    | {
          type: "st";
          title: string;
          stars: number;
      };

export type QuestionSection = {
    title: string;
    headersize: number;
    questions: string[];
    index: number;
};

type Questions = {
    [questionId: string]: Question;
};

type Sections = {
    [sectionId: string]: QuestionSection;
};

/**
 * @returns {number} Number of questions
 */
export function getNumOfQuestions() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return 0;
    }

    try {
        const questionsAmount = Object.keys(
            JSON.parse(data).prescout.structure,
        ).length;
        return questionsAmount;
    } catch (e) {
        console.error(`ERROR: Could not get amount of questions: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return 0;
    }
}

/**
 * Returns all current sections in prescouting data
 * @returns {Sections} Sections
 */
export function getSections() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }

    try {
        const sections = JSON.parse(data).prescout.sections as Sections;
        return sections;
    } catch (e) {
        console.error(`ERROR: Could not get sections: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {};
    }
}

/**
 * Returns data of specific section based on id
 * @returns {QuestionSection} Section
 */
export function getSection(id: string) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as QuestionSection;
    }

    try {
        const section = JSON.parse(data).prescout.sections[
            id
        ] as QuestionSection;
        return section;
    } catch (e) {
        console.error(`ERROR: Could not get section: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as QuestionSection;
    }
}

/**
 * Returns all current questions in prescouting data
 * @returns {Questions} Questions
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
 * Returns specific question based on id
 * @param {string} id - QuestionId
 * @returns {Question} Question
 */
export function getQuestion(id: string) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as Question;
    }

    try {
        const question = JSON.parse(data).prescout.structure[id] as Question;
        return question;
    } catch (e) {
        console.error(`ERROR: Could not get question: ` + e);
        errorToast(i18n.t("dataloaderror"), 3000);
        return {} as Question;
    }
}

/**
 * Add question to competition
 * @param {boolean} show - Whether to show success toasts or not (Default false)
 * @param {Question} question - Question
 * @param {string} section - Section Id (Default "0")
 */
export function addQuestion(
    show: boolean = false,
    question: Question = {
        type: "ln",
        title: "New Question",
    },
    section: string = Object.keys(getSections())[0],
) {
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

        if (!parsed.prescout.sections[section]) {
            console.error("ERROR: Section does not exist");
            return;
        }

        parsed.prescout.structure[id.toString()] = question;
        parsed.prescout.sections[section].questions.push(id.toString());

        localStorage.setItem("data", JSON.stringify(parsed));
        useQuestions.getState().setQuestions(getQuestions());
        useSections.getState().setSections(getSections());
        if (show) {
            successToast(i18n.t("questionadded"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not add question: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Delete question of choice
 * @param {string} id - Id of question to be deleted
 * @param {boolean} show - whether to show success toasts or not (Default false)
 */
export function deleteQuestion(id: string, show: boolean = false) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        if (!parsed.prescout.structure[id]) {
            console.warn("WARNING: Question  does not exist");
            return;
        }
        delete parsed.prescout.structure[id];

        Object.values(parsed.prescout.teams as Teams).forEach((team) => {
            delete team.data[id];
        });

        Object.values(parsed.prescout.sections as Sections).forEach(
            (section: QuestionSection) => {
                section.questions = section.questions.filter(
                    (questionId) => questionId !== id,
                );
            },
        );

        localStorage.setItem("data", JSON.stringify(parsed));
        useQuestions.getState().setQuestions(getQuestions());
        useSections.getState().setSections(getSections());
        useTeams.getState().setTeams(getTeams());
        if (show) {
            successToast(i18n.t("questiondeleted"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not delete question: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * @param {string} id - Question ID
 * @param {Partial<Question>} changes - Changes to question
 * @param {boolean} show - Whether to show success toasts or not (Default false)
 * @returns
 */
export function updateQuestion(
    id: string,
    changes: Partial<Question>,
    show: boolean = false,
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

        if (show) {
            successToast(i18n.t("questionupdated"), 2000);
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
 * Add section to scouting
 * @param {QuestionSection} section - Section
 * @param {boolean} show - Whether to show success toasts or not  (Default false)
 */
export function addSection(section: QuestionSection, show: boolean = false) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        const currentIndexes = Object.values(
            parsed.prescout.sections as Sections,
        ).map((section: QuestionSection) => section.index);

        let index = 0;
        while (currentIndexes.includes(index)) {
            index++;
        }

        section.index = index;

        const currentIds = Object.keys(parsed.prescout.sections).map(Number);
        let id = 0;
        while (currentIds.includes(id)) {
            id++;
        }

        parsed.prescout.sections[id.toString()] = section;

        localStorage.setItem("data", JSON.stringify(parsed));
        useSections.getState().setSections(getSections());
        if (show) {
            successToast(i18n.t("sectionadded"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not add section: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Delete section of choice
 * @param {string} id - Id of section to be deleted
 * @param {boolean} deleteQuestions - Whether to delete questions in section, or assign them to section with previous index OR the next index if previous does not exist
 * @param {boolean} show - whether to show success toasts or not  (Default false)
 */
export function deleteSection(
    id: string,
    deleteQuestions: boolean,
    show: boolean = false,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);
        if (!parsed.prescout.sections[id]) {
            console.warn("WARNING: Section  does not exist");
            return;
        }
        if (Object.keys(parsed.prescout.sections).length === 1) {
            console.error("ERROR: At least one section MUST remain");
            return;
        }
        if (deleteQuestions) {
            parsed.prescout.sections[id].questions.forEach(
                (question: string) => {
                    delete parsed.prescout.structure[question];
                },
            );
        } else {
            const sectionIndex = parsed.prescout.sections[id].index;

            const previousSection = Object.entries(
                parsed.prescout.sections,
            ).find(
                ([sectionId, section]) =>
                    sectionId !== id &&
                    (section as QuestionSection).index === sectionIndex - 1,
            )?.[0];

            const nextSection = Object.entries(parsed.prescout.sections).find(
                ([sectionId, section]) =>
                    sectionId !== id &&
                    (section as QuestionSection).index === sectionIndex + 1,
            )?.[0];

            if (previousSection) {
                parsed.prescout.sections[previousSection].questions.push(
                    ...parsed.prescout.sections[id].questions,
                );
            } else if (nextSection) {
                parsed.prescout.sections[nextSection].questions.unshift(
                    ...parsed.prescout.sections[id].questions,
                );
            } else {
                console.error("ERROR: No section found to move questions to");
                return;
            }
        }
        delete parsed.prescout.sections[id];
        Object.entries(parsed.prescout.sections)
            .sort(([, a], [, b]) => (a as any).index - (b as any).index)
            .forEach(([sectionId, section], index) => {
                parsed.prescout.sections[sectionId] = {
                    ...(section as object),
                    index,
                };
            });
        localStorage.setItem("data", JSON.stringify(parsed));
        useSections.getState().setSections(getSections());

        if (show) {
            successToast(i18n.t("sectiondeleted"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not delete section: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Function to update a section
 * @param {string} id - Section ID
 * @param {Partial<QuestionSection>} changes - Changes to section
 * @param {boolean} show - Whether to show success toasts or not
 */
export function updateSection(
    id: string,
    changes: Partial<QuestionSection>,
    show: boolean = false,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        const sectionToEdit = parsed.prescout.sections[id];

        if (!sectionToEdit) {
            console.error("ERROR: Question does not exist to edit");
            return;
        }

        parsed.prescout.sections[id] = {
            ...sectionToEdit,
            ...changes,
        };

        localStorage.setItem("data", JSON.stringify(parsed));

        useSections.getState().setSections(getSections());

        if (show) {
            successToast(i18n.t("sectionupdated"), 2000);
        }
    } catch (e) {
        console.error("ERROR: Could not edit section: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

export const useSections = create<{
    sections: Sections;
    setSections: (value: Sections) => void;
}>((set) => ({
    sections: getSections(),
    setSections: (value) => set({ sections: value }),
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
