export type UserProps = UserLogin & {
    id: number;
};

export type UserLogin = {
    name: string;
    password: string;
};

export type UserToken = {
    token: string;
};