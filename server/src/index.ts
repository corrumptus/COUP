import http, { Server } from 'http'
import api from './api/api';
import initSocket from './socket';

require('dotenv').config();

const PORT: number = Number(process.env.PORT);

const server: Server = http.createServer(api);

server.listen(PORT);

initSocket(server);