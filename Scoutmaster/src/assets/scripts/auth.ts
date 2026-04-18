export type SignUpData = {
    email: string;
    password: string;
};

export type SignUpFocus = {
    email: boolean;
    password: boolean;
};

export function signUp(data: SignUpData) {
    console.log(data);
}
