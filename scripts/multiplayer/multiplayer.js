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

    socket.emit('player-number', {
        player: playerNumber,
        status: 'connected',
    });

    console.log(`Player ${playerNumber} connected`);

    if (playerNumber === -1) return;

    connections[playerNumber] = false;

    socket.broadcast.emit('player-connection', {
        player: playerNumber,
        status: 'connected',
    });

    socket.on('disconnect', () => {
        console.log(`Player ${playerNumber} disconnected`);
        connections[playerNumber] = null;
        socket.broadcast.emit('player-connection', {
            player: playerNumber,
            status: 'disconnected',
        });
    });

    socket.on('check-players', () => {
        const players = [];
        for (const i in connections) {
            connections[i] === null ? players.push('disconnected') : players.push('connected');
        }
        socket.emit('check-players', players);
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
