import { AES } from "crypto-js";
import { SignJWT, jwtVerify } from "jose";
import type { UserLoginProps, UserLoginToken } from "@entitys/User";
import UserRepository from "@repositorys/UserRepository";
import { isObject, isString } from "@utils/utils";

export default class UserService {
    private static mySecret = new TextEncoder().encode(process.env.SECRET_KEY);

    static async login(user: any): Promise<UserLoginToken> {        
        UserService.isLoginOrThrows(user);

        await UserService.verifyLogin(user);

        return await UserService.generateToken(user.name);
    }

    static async loginByToken(token: any): Promise<UserLoginToken> {
        await UserService.isValidToken(token);

        return UserService.generateToken(await UserService.getName(token));
    }

    static async signup(user: any): Promise<UserLoginToken> {
        UserService.isLoginOrThrows(user);

        await UserService.verifySignUp(user);

        const newUser = await UserRepository.addUser({
            name: user.name,
            password: UserService.encryptPassword(user.password)
        });

        if (newUser === null)
            throw new Error("Failed to add user: " + user.name + ". Try again later.");

        return await UserService.generateToken(newUser.name);
    }

    static async isValidToken(token: any): Promise<boolean> {
        try {
            const name = (await jwtVerify(
                token,
                UserService.mySecret,
                {
                    issuer: "COUP Game",
                    maxTokenAge: "2 days",
                    clockTolerance: "30 day"
                }
            )).payload.sub;

            return name !== undefined;
        } catch (error) {
            return false;
        }
    }

    private static async verifyLogin(user: UserLoginProps) {
        const { name, password } = user;

        const userDB = await UserRepository.getUser(name);

        if (userDB === null)
            throw new Error("User not found: " + name);

        const spectedPassword = userDB.password;

        if (UserService.encryptPassword(password) !== spectedPassword)
            throw new Error("Invalid login or password");
    }

    private static async verifySignUp(user: UserLoginProps) {
        const userDB = await UserRepository.getUser(user.name);

        console.log("select");

        if (userDB !== null)
            throw new Error("User already exists: " + user.name);
    }

    private static async generateToken(name: string): Promise<UserLoginToken> {
        return await new SignJWT()
            .setProtectedHeader({ alg: "HS256" })
            .setIssuer("COUP Game")
            .setSubject(name)
            .setIssuedAt()
            .sign(UserService.mySecret);
    }

    private static encryptPassword(password: string): string {
        return AES.encrypt(password, UserService.mySecret.toString()).toString();
    }

    static async getName(token: string): Promise<string | undefined> {
        try {
            return (await jwtVerify(
                token,
                UserService.mySecret,
                {
                    issuer: "COUP Game",
                    maxTokenAge: "1 year",
                    clockTolerance: "30 days"
                }
            )).payload.sub;
        } catch (error) {
            return undefined;
        }
    }

    private static isLoginOrThrows(obj: any): asserts obj is UserLoginProps {
        if (!isObject(obj))
            throw new Error("The parameter must be a Object");

        if (!("name" in obj) || !("password" in obj))
            throw new Error("The object must have the following properties: name, password");

        if (!isString(obj.name))
            throw new Error("Name cannot be a blank string");

        if (obj.name.trim() === "")
            throw new Error("Name cannot be a blank string");

        if (!isString(obj.password))
            throw new Error("Password cannot be a blank string");

        if (obj.password.trim() === "")
            throw new Error("Password cannot be a blank string");
    }

    private static isTokenOrThrows(token: any): asserts token is UserLoginToken {
        if (token === undefined)
            throw new Error("Token must be provided");

        if (!isString(token))
            throw new Error("Token must be a string");

        if (token.trim() === "")
            throw new Error("Token cannot be blank");
    }
}