import type { Team } from "./teams";
import { successToast, errorToast } from "../misc/toastmanager";
import i18n from "../localization";

export type PrescoutData = {
    structure: Question[];
    sections: QuestionSection[];
    teams: {
        [teamId: string]: Team;
    };
};

export type Question =
    | {
          id: string;
          type: "ln" | "sn" | "cb" | "a" | "img" | "n";
          title: string;
      }
    | {
          id: string;
          type: "mc" | "sc";
          title: string;
          opt: {
              [key: string]: string;
          };
      }
    | {
          id: string;
          type: "r";
          title: string;
          minmax: [number, number];
      }
    | {
          id: string;
          type: "st";
          title: string;
          stars: number;
      };

export type QuestionSection = {
    title: string;
    headersize: 1 | 2 | 3;
    questions: string[];
};

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
