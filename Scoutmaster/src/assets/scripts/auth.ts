import { createClient } from "@supabase/supabase-js";
import { connectToSession } from "./serverutils/realtime";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: "pkce",
        lock: (name, acquireTimeout, fn) => fn(),
    },
});

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
export async function signUp(data: UserData): Promise<"Success" | `Error`> {
    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `http://localhost:5173/dashboard`,
        },
    });

    if (error) {
        return `Error`;
    }

    return "Success";
}

/**
 * Signs in an existing user.
 *
 * @param {UserData} data - Login credentials for the user.
 * @returns {Promise<"Success" | string>} Resolves to "Success" or an error message in the format "Error: message".
 */
export async function signIn(data: UserData): Promise<"Success" | string> {
    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        if (error.status && error.status >= 500) {
            return "supabase_down_error";
        }
        switch (error.code) {
            case "invalid_credentials":
                return error.code;

            case "email_not_confirmed":
                return error.code;

            case "over_request_rate_limit":
                return error.code;

            default:
                return "other_error";
        }
    }

    await connectToSession();

    return "Success";
}

/**
 * @returns {boolean} Whether the user is signed in.
 */
export async function isUserSignedIn(): Promise<boolean> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user !== null;
}

// export async function isUserAdmin(): Promise<boolean> {

// }

/**
 * Returns the number of members in user's group
 * @returns {number} Number of Members
 */
export function getNumberOfMembers() {
    return 1;
}
