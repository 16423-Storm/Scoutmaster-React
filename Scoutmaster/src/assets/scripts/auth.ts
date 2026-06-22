export type UserData = {
    email: string;
    password: string;
};

export type SignUpFocus = {
    email: boolean;
    password: boolean;
};

/**
 * Registers a new user account.
 *
 * @param {UserData} data - Sign up credentials for the user.
 * @returns {Promise<"Success" | `Error: ${string}`>} A promise that resolves to:
 * - "Success" when the signup succeeds
 * - "Error: message" when the signup fails
 */
export function signUp(data: UserData) {
    console.log(data);
}

/**
 * Signs in an existing user.
 *
 * @param {UserData} data - Login credentials for the user.
 * @returns {Promise<"Success" | string>} Resolves to "Success" or an error message in the format "Error: message".
 */
export function signIn(data: UserData) {
    console.log(data);
}

/**
 * @returns {boolean} Whether the user is signed in.
 */
export function isUserSignedIn() {
    return true;
}

/**
 * Returns the number of members in user's group
 * @returns {number} Number of Members
 */
export function getNumberOfMembers() {
    return 1;
}
