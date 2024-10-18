import express, { Express } from "express";
import cors from "cors";
import { UserLogin, UserToken } from "../entity/User";
import UserService from "../service/UserService";
import UserValidator from "../utils/UserValidator";
import LobbyService from "../service/LobbyService";

const api: Express = express();

api.use(express.json());

api.use(cors());

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

export default api;