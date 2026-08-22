import type { Team, Teams } from "./teams";
import { successToast, errorToast } from "../misc/toastmanager";
import i18n from "../localization";
import { create } from "zustand";
import { nanoid } from "nanoid";

import { sendMessage } from "../serverutils/realtime";

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
 * Sends request to server to add a question to competition, does NOT save to storage on its own
 */
export async function addQuestion() {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const requestId = nanoid(10);

        const confirmed = await sendMessage({
            type: "addQuestion",
            content: {},
            requestId,
        });

        if (!confirmed) {
            errorToast(i18n.t("seterror"), 3000);
            return;
        }
    } catch (e) {
        console.error("ERROR: Could not add question: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Save added question to localstorage
 * @param {boolean} show - Whether to show success toasts or not (Default false)
 * @param {string} questionId - Question ID
 * @param {string} sectionId - Parent section ID of question
 */
export async function addQuestionToStorage(
    show: boolean = false,
    questionId: string,
    sectionId: string,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        if (Object.keys(parsed.prescout.structure).length >= 30) {
            errorToast(i18n.t("maxquestions"), 3000);
            return;
        }

        if (!parsed.prescout.sections[sectionId]) {
            console.error("ERROR: Section does not exist");
            return;
        }

        parsed.prescout.structure[questionId] = {
            type: "sn",
            title: "New Question",
        };
        parsed.prescout.sections[sectionId].questions.push(questionId);

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
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function deleteQuestion(
    id: string,
    show: boolean = false,
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
        const originalParsed = JSON.parse(data);

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

        if (!sendServer && show) {
            successToast(i18n.t("questiondeleted"), 2000);
        }

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteQuestion",
                content: {
                    id: id,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                localStorage.setItem("data", JSON.stringify(originalParsed));
                useQuestions.getState().setQuestions(getQuestions());
                useSections.getState().setSections(getSections());
                return;
            } else {
                successToast(i18n.t("questiondeleted"), 2000);
            }
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
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function updateQuestion(
    id: string,
    changes: Partial<Question>,
    show: boolean = false,
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

        const questionToEdit = parsed.prescout.structure[id];

        if (!questionToEdit) {
            console.error("ERROR: Question does not exist to edit");
            return;
        }

        const updatedQuestion = (parsed.prescout.structure[id] = {
            ...questionToEdit,
            ...changes,
        });

        if (updatedQuestion.type !== "r") {
            delete updatedQuestion.minmax;
        }

        if (updatedQuestion.type !== "st") {
            delete updatedQuestion.stars;
        }

        if (updatedQuestion.type !== "mc" && updatedQuestion.type !== "sc") {
            delete updatedQuestion.opt;
        }

        parsed.prescout.structure[id] = updatedQuestion;

        Object.values(parsed.prescout.teams as Teams).forEach((team) => {
            delete team.data[id];
        });

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "updateQuestion",
                content: {
                    id: id,
                    changes: changes,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

        localStorage.setItem("data", JSON.stringify(parsed));

        useTeams.getState().setTeams(getTeams());
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
 * Send request to server to add section, this does NOT actually add it to localstorage though
 * @param {QuestionSection} section - Section
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function addSection(
    section: QuestionSection,
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

        if (Object.keys(parsed.prescout.sections).length >= 10) {
            errorToast(i18n.t("maxsections"), 3000);
            return;
        }

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "addSection",
                // hs = headerSize
                content: {
                    title: section.title,
                    hs: section.headersize,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }
    } catch (e) {
        console.error("ERROR: Could not add section: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Save section to localStorage
 * @param {QuestionSection} section - Section
 * @param {boolean} show - Whether to show success toasts or not
 * @param {string} id - The ID of the section
 */
export async function addSectionToStorage(
    section: QuestionSection,
    show: boolean,
    id: string,
) {
    const data = localStorage.getItem("data");
    if (!data) {
        console.error(`ERROR: Could not get item "data" from localstorage`);
        errorToast(i18n.t("dataloaderror"), 3000);
        return;
    }

    try {
        const parsed = JSON.parse(data);

        if (Object.keys(parsed.prescout.sections).length >= 10) {
            errorToast(i18n.t("maxsections"), 3000);
            return;
        }

        parsed.prescout.sections[id] = section;

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
 * Send signal to server to delete section, this does NOT delete section on its own
 * @param {string} id - Id of section to be deleted
 * @param {boolean} deleteQuestions - Whether to delete questions in section, or assign them to section with previous index OR the next index if previous does not exist
 * @param {boolean} show - Whether to show success toasts or not  (Default false)
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function deleteSection(
    id: string,
    deleteQuestions: boolean,
    show: boolean = false,
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

        if (!parsed.prescout.sections[id]) {
            console.warn("WARNING: Section  does not exist");
            return;
        }

        if (Object.keys(parsed.prescout.sections).length === 1) {
            console.error("ERROR: At least one section MUST remain");
            return;
        }

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "deleteSection",
                // dq = deleteQuestions
                content: {
                    id: id,
                    dq: deleteQuestions,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
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

        if (sendServer) {
            console.log("SEND TO SERVER");
        }
    } catch (e) {
        console.error("ERROR: Could not delete section: " + e);
        errorToast(i18n.t("seterror"), 3000);
        return;
    }
}

/**
 * Delete section from localstorage
 * @param {string} id - Id of section to be deleted
 * @param {boolean} deleteQuestions - Whether to delete questions in section, or assign them to section with previous index OR the next index if previous does not exist
 * @param {string | null} target - Target section to send questions to if questions are not deleted
 * @param {boolean} before - Whether to send questions to the section before (above when true), or after (below when false)
 * @param {boolean} show - Whether to show success toasts or not  (Default false)
 */
export async function deleteSectionFromStorage(
    id: string,
    deleteQuestions: boolean,
    indexes: { [sectionId: string]: number },
    target: string | null,
    before: boolean,
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

        if (deleteQuestions) {
            parsed.prescout.sections[id].questions.forEach(
                (question: string) => {
                    delete parsed.prescout.structure[question];
                },
            );
        }

        if (!deleteQuestions && target) {
            const targetSection = parsed.prescout.sections[target];

            if (before) {
                targetSection.questions = [
                    ...parsed.prescout.sections[id].questions,
                    ...targetSection.questions,
                ];
            } else {
                targetSection.questions.push(
                    ...parsed.prescout.sections[id].questions,
                );
            }
        }

        for (const [sectionId, index] of Object.entries(indexes)) {
            parsed.prescout.sections[sectionId].index = index;
        }

        delete parsed.prescout.sections[id];

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
 * @param {boolean} sendServer - Send data to server for update, true by default
 */
export async function updateSection(
    id: string,
    changes: Partial<QuestionSection> & {
        title: string;
        headersize: number;
    },
    show: boolean = false,
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

        const sectionToEdit = parsed.prescout.sections[id];

        if (!sectionToEdit) {
            console.error("ERROR: Question does not exist to edit");
            return;
        }

        parsed.prescout.sections[id] = {
            ...sectionToEdit,
            ...changes,
        };

        if (sendServer) {
            const requestId = nanoid(10);

            const confirmed = await sendMessage({
                type: "updateSection",
                // hs = headerSize
                content: {
                    id: id,
                    hs: changes.headersize,
                    title: changes.title,
                },
                requestId,
            });

            if (!confirmed) {
                errorToast(i18n.t("seterror"), 3000);
                return;
            }
        }

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
