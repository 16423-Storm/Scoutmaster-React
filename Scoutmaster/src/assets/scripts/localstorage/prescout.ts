import type { Team } from "./teams";

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
