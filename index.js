import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import serverRoutes from './routes/servers.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(
    cors({
        origin: '*',
        credentials: true,
        optionSuccessStatus: 200,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(serverRoutes);

// * ================= testing if server is working ================

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});
