import http, { Server } from 'http'
import api from '@api/api';
import initSocket from '@socket/socket';

require('dotenv').config();

const server: Server = http.createServer(api);

server.listen(5000);

initSocket(server);