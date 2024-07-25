export type UserLogin = {
    name: string;
    password: string;
}

export type UserProps = UserLogin & {
    id: number;
}

export type UserToken = string