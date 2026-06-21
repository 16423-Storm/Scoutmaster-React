// GENERAL LOCAL STORAGE MANAGEMENT
export function clearLocalStorage() {
    localStorage.clear();
}

/**
 * Creates the base skeleton structure for localstorage
 */
export function createSkeleton() {}

// PRESCOUT MANAGEMENT
//
//
//
//
//
//
//
//
//
//
//
// PRESCOUT MANAGEMENT

export type PrescoutData = {
    structure: {
        numOfQuestions: number;
        questionOrder: string[];
    };
    teams: {
        [teamId: string]: {
            data?: any[];
            matchesIn: [number];
        };
    };
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
        throw new TypeError("team must be a numeric string");
    }
}

export function addDataToTeam() {}

export function resetTeam() {}

// MATCH MANAGEMENT
//
//
//
//
//
//
//
//
//
//
//
// MATCH MANAGEMENT

export type MatchData = {
    [matchNum: string]: {
        highlighted: boolean[];
        teams: number[];
        red1: number[];
        red2: number[];
        blue1: number[];
        blue2: number[];
    };
};
