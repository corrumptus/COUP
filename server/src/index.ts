import express, { Express } from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';
import User from './entity/User';
import UserService from './service/UserService';

require('dotenv').config();

const api: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

api.use(express.json());

api.listen(PORT, () => console.log(`server started in ${PORT}`));

api.post("/login", async (req, res) => {
    try {
        const user = User.fromUnknownObject(req.body);

        const newToken = await UserService.login(user);

        res.status(200).send({
            token: newToken,
            socketInfos: {
                url: req.protocol + '://' + req.get('host') + req.originalUrl,
                name: user.getName()
            }
        });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

api.post("/signup", async (req, res) => {
    try {
        const user = User.fromUnknownObject(req.body);

        const newToken = await UserService.signup(user);

        res.status(200).send({
            token: newToken,
            socketInfos: {
                url: req.protocol + '://' + req.get('host') + req.originalUrl,
                name: user.getName()
            }
        });
    } catch (error) {
        res.status(401).send({ error: (error as Error).message });
    }
});

const server: http.Server = http.createServer(api);
const serverSocket: Server = new Server(server);

serverSocket.on("connection", (socket: Socket) => {
    console.log(`${socket.id} connected`);
});