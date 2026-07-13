// export type PrescoutData = {
//     structure: {
//         numOfQuestions: number;
//         questionOrder: string[];
//     };
//     teams: {
//         [teamId: string]: Team;
//     };
// };

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
