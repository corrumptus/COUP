import express, { Express } from "express";
import { UserLogin, UserToken } from "../entity/User";
import UserService from "../service/UserService";
import UserValidator from "../utils/UserValidator";

const api: Express = express();

api.use(express.json());

api.post("/login", async (req, res) => {
    try {
        if (!UserValidator.isLogin(req.body))
            return;

        const user: UserLogin = req.body;

        const newToken = await UserService.login(user);

        res.status(200).send({
            token: newToken,
            socketInfos: {
                url: req.protocol + '://' + req.get('host') + req.originalUrl,
                name: user.name
            }
        });
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

        res.status(200).send({
            token: newToken,
            socketInfos: {
                url: req.protocol + '://' + req.get('host') + req.originalUrl,
                name: await UserService.getName(token.token) as string
            }
        });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
})

api.post("/signup", async (req, res) => {
    try {
        if (!UserValidator.isLogin(req.body))
            return;

        const user: UserLogin = req.body;

        const newToken = await UserService.signup(user);

        res.status(200).send({
            token: newToken,
            socketInfos: {
                url: req.protocol + '://' + req.get('host') + req.originalUrl,
                name: user.name
            }
        });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

export default api;