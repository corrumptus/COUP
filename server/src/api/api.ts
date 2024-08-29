import express, { Express } from "express";
import { UserLogin, UserToken } from "../entity/User";
import UserService from "../service/UserService";
import UserValidator from "../utils/UserValidator";
import LobbyService from "../service/LobbyService";
import PlayerService from "../service/PlayerService";

const api: Express = express();

api.use(express.json());

api.post("/login", async (req, res) => {
    try {
        if (!UserValidator.isLogin(req.body))
            return;

        const user: UserLogin = req.body;

        const newToken = await UserService.login(user);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/login/token", async (req, res) => {
    try {
        if (!UserValidator.isToken(req.body))
            return;

        const token: UserToken = req.body;

        const newToken = await UserService.loginByToken(token);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/signup", async (req, res) => {
    try {
        if (!UserValidator.isLogin(req.body))
            return;

        const user: UserLogin = req.body;

        const newToken = await UserService.signup(user);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.get("/lobby", (_, res) => {
    res.send(LobbyService.allLobbys);
});

api.post("/lobby", async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!UserValidator.isToken(token))
            throw new Error("The user cannot enter into servers without being logged in");

        await UserService.loginByToken(token);

        const name = await UserService.getName(token) as string;

        PlayerService.addWaitingPlayer(name, true);

        res.send();
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/lobby/:id", async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!UserValidator.isToken(token))
            throw new Error("The user cannot enter into servers without being logged in");

        await UserService.loginByToken(token);

        const name = await UserService.getName(token) as string;

        PlayerService.addWaitingPlayer(name, true, Number(req.params.id));

        res.send();
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/lobby/nonLogged", async (req, res) => {
    try {
        const name = req.body.name;

        if (name === undefined)
            throw new Error("User must provide a name");

        PlayerService.addWaitingPlayer(name, false);

        res.send();
    } catch (error) {
        res.send(401).send({ error: (error as Error).message });
    }
});

api.post("/lobby/nonLogged/:id", async (req, res) => {
    try {
        const name = req.body.name;

        if (name === undefined)
            throw new Error("User must provide a name");

        PlayerService.addWaitingPlayer(name, false, Number(req.params.id));

        res.send();
    } catch (error) {
        res.send(401).send({ error: (error as Error).message });
    }
});

export default api;