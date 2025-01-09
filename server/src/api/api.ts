import express, { Express } from "express";
import cors from "cors";
import LobbyService from "@services/LobbyService";
import UserService from "@services/UserService";

const api: Express = express();

api.use(express.json());

api.use(cors());

api.post("/login", async (req, res) => {
    try {
        const newToken = await UserService.login(req.body);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/login/token", async (req, res) => {
    try {
        const newToken = await UserService.loginByToken(req.body);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/signup", async (req, res) => {
    try {
        const newToken = await UserService.signup(req.body);

        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.get("/lobby", (_, res) => {
    res.send(LobbyService.allLobbys);
});

export default api;