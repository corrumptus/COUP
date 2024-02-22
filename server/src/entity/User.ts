export type UserProps = {
    id: number;
    name: string;
    password: string;
};

export default class User {
    private id?: number;
    private name?: string;
    private password?: string;
    private token?: string;

    constructor(userProps: UserProps) {
        this.id = userProps.id;
        this.name = userProps.name;
        this.password = userProps.password;
    }

    static fromUnknownObject(unknown: any): User {
        const newUser = new User({ id: 0, name: "", password: "" });

        if (unknown.token !== undefined) {
            newUser.token = unknown.token;
        } else {
            newUser.name = unknown.name;
            newUser.password = unknown.password;
        }

        if (!newUser.isValid)
            throw new Error("Invalid user");

        return newUser;
    }

    get isToken(): boolean {
        return this.token !== undefined;
    }

    private get isValid(): boolean {
        if (this.isToken)
            return User.isNotUndefinedNorNullNorBlank(this.token);

        return User.isNotUndefinedNorNullNorBlank(this.name)
            && User.isNotUndefinedNorNullNorBlank(this.password);
    }

    private static isNotUndefinedNorNullNorBlank(str: string | undefined | null): boolean {
        const isUndefined = str === undefined;
        const isNull = str === null;
        const isBlank = isUndefined || isNull || str.trim() === "";

        return !isBlank;
    }

    getToken(): string {
        return this.token as string;
    }

    getUserProps(): UserProps {
        return {
            id: this.id as number,
            name: this.name as string,
            password: this.password as string
        };
    }

    getName(): string {
        return this.name as string;
    }
}