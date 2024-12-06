import { AES } from "crypto-js";
import { SignJWT, jwtVerify } from "jose";
import { UserLogin, UserToken } from "@entitys/User";
import UserRepository from "@repositorys/UserRepository";

export default class UserService {
    private static mySecret: Uint8Array = new TextEncoder().encode(process.env.SECRET_KEY);

    static async login(user: UserLogin): Promise<string> {
        return await UserService.verifyFromProps(user);
    }

    static async loginByToken(token: UserToken): Promise<string> {
        return await UserService.verifyFromToken(token);
    }

    static async signup(user: UserLogin): Promise<string> {
        if (await UserService.verifyFromProps(user))
            throw new Error("User already exists: " + user.name);

        user.password = UserService.encryptPassword(user.password);

        const newUser = await UserRepository.addUser(user);

        if (newUser === null)
            throw new Error("Failed to add user: " + user.name + ". Try again later.");

        return await UserService.generateToken(newUser.name);
    }

    private static async verifyFromToken(token: UserToken): Promise<string> {
        let name: string | undefined;

        try {
            name = (await jwtVerify(
                token,
                UserService.mySecret,
                {
                    issuer: "COUP Game",
                    maxTokenAge: "2 days",
                    clockTolerance: "30 day"
                }
            )).payload.sub;
        } catch (error) {
            throw new Error("Invalid token: " + token);
        }

        if (name === undefined)
            throw new Error("Invalid Token");

        if (await UserRepository.getUser(name) === null)
            throw new Error("User not found: " + name);

        return await UserService.generateToken(name);
    }

    private static async verifyFromProps(user: UserLogin): Promise<string> {
        const { name, password } = user;

        const userDB = await UserRepository.getUser(name);

        if (userDB === null)
            throw new Error("User not found: " + name);

        const spectedPassword = userDB.password;

        if (UserService.encryptPassword(password) !== spectedPassword)
            throw new Error("Invalid login or password");

        return await UserService.generateToken(name);
    }

    private static async generateToken(name: string): Promise<string> {
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
                    maxTokenAge: "2 days",
                    clockTolerance: "30 day"
                }
            )).payload.sub;
        } catch (error) {
            return undefined;
        }
    }
}