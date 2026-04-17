export type SignUpData = {
    name: string;
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
