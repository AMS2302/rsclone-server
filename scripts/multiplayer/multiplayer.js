const connections = [null, null];

function getPlayerNumber(array) {
    let number = -1;

    for (const i in array) {
        if (array[i] === null) {
            number = i;
            break;
        }
    }

    return number;
}

export default function multiplayer(socket) {
    console.log('multiplayer is started...');

    let playerNumber = getPlayerNumber(connections);

    socket.emit('player-number', playerNumber);

    console.log(`Player ${playerNumber} connected`);

    if (playerNumber === -1) return;

    connections[playerNumber] = false;

    socket.broadcast.emit('player-connection', `${playerNumber} connected`);
    // todo: изменить второй параметр в зависимоти от реализации на клиенте

    socket.on('disconnect', () => {
        console.log(`Player ${playerNumber} disconnected`);
        connections[playerNumber] = null;
        socket.broadcast.emit('player-connection', `${playerNumber} disconnected`);
    });

    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', 'enemy is ready');
        // todo: изменить второй параметр в зависимоти от реализации на клиенте
        connections[playerNumber] = true;
    });

    socket.on('fire', (id) => {
        console.log(`Shot fired from ${playerNumber}`, id);
        socket.broadcast.emit('fire', id);
    });

    socket.on('fire-reply', (square) => {
        console.log(square);
        socket.broadcast.emit('fire-reply', square);
    });
}
