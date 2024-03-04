import express, { Express } from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';
import { UserLogin, UserToken } from './entity/User';
import UserService from './service/UserService';
import PlayerService from './service/PlayerService';
import LobbyService from './service/LobbyService';
import GameService from './service/GameService';
import ModifiedSocket from './utils/ModifiedSocket';
import UserValidator from './utils/UserValidator';

require('dotenv').config();

const api: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

api.use(express.json());

api.listen(PORT, () => console.log(`server started in ${PORT}`));

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

const server: http.Server = http.createServer(api);
const serverSocket: Server = new Server(server);

serverSocket.on("connection", (socket: Socket) => {
    const modifiedSocket: ModifiedSocket = new ModifiedSocket(socket);

    PlayerService.setListeners(modifiedSocket);

    LobbyService.setListeners(modifiedSocket);

    GameService.setListeners(modifiedSocket);
});