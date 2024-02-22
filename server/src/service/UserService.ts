import User, { UserProps } from "../entity/User";
import { SignJWT, jwtVerify } from "jose";
import UserRepository from "../repository/UserRepository";
import { AES } from "crypto-js";

export default class UserService {
    private static mySecret: Uint8Array = new TextEncoder().encode(process.env.SECRET_KEY || "12345678");

    static async login(user: User): Promise<string> {
        let newToken: string;

        if (user.isToken)
            newToken = await UserService.verifyFromToken(user.getToken());
        else
            newToken = await UserService.verifyFromProps(user.getUserProps());

        return newToken;
    }

    static async signup(user: User): Promise<string> {
        if (user.isToken)
            throw new Error("Invalid user: null");

        if (await UserService.verifyFromProps(user.getUserProps()))
            throw new Error("User already exists: " + user.getUserProps().name);

        user.getUserProps().password = UserService.encryptPassword(user.getUserProps().password);

        const newUser = await UserRepository.addUser(user.getUserProps());

        if (newUser === null)
            throw new Error("Failed to add user: " + user.getUserProps().name + ". Try again later.");

        return await UserService.generateToken(newUser.getUserProps().name);
    }

    private static async verifyFromToken(token: string): Promise<string> {
        let name: string | undefined;

        try {
            name = (await jwtVerify(
                token,
                UserService.mySecret,
                {
                    issuer: "COUP Game",
                    maxTokenAge: "2 days",
                    clockTolerance: "1 day"
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

    private static async verifyFromProps(props: UserProps): Promise<string> {
        const { name, password } = props;

        const userDB = await UserRepository.getUser(name);

        if (userDB === null)
            throw new Error("User not found: " + name);

        const spectedPassword = userDB.getUserProps().password;

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
}