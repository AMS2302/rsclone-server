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

    socket.on('disconnect', () => {
        console.log(`Player ${playerNumber} disconnected`);
        connections[playerNumber] = null;
        socket.broadcast.emit('player-connection', `${playerNumber} disconnected`);
    });
}
