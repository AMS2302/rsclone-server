import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import multiplayer from './scripts/multiplayer/multiplayer.js';

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = `http://localhost:${PORT}`;
const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: '*',
        credentials: true,
        optionSuccessStatus: 200,
    })
);

const io = new Server(server, {
    cors: ALLOWED_ORIGIN,
    serveClient: false,
});

// * ================= testing if server is working ================

// io.on('connection', (socket) => {
//     console.log('...a user connected');
//     socket.on('disconnect', () => {
//         console.log('...user disconnected');
//     });
// });

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});

// * ===============================================================

io.on('connection', multiplayer);
