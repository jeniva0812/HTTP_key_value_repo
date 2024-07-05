const { read } = require('node:fs');
const net = require('node:net');

const server = net.createServer();

// Map to store client data
const clientData = new Map();
// Map to store client roles
const clientRoles = new Map();

server.on('connection', (socket) => {
    // Assign a default role of 'guest' to the client
    clientRoles.set(socket, 'guest');
    clientData.set(socket, { id: generateClientId(), data: {} });

    socket.on('data', (data) => {
        const message = data.toString().trim().split('\n');

        for (let i = 0; i < message.length; i++) {
            if (message[i].toLowerCase() === 'get') {
                handleGet(socket, message[i + 1]);
                i++;
            } else if (message[i].toLowerCase() === 'm') {
                upgradeToManager(socket);
            } else if (message[i].toLowerCase() === 'put') {
                handlePut(socket, message[i + 1], message[i + 2]);
                i = i + 2;
            }
        }
    });

    socket.on('end', () => {
        console.log("Client disconnected.");
        // Clean up client data and role on disconnect
        clientData.delete(socket);
        clientRoles.delete(socket);
    });
});

function handleGet(socket, key) {
    const role = clientRoles.get(socket);
    const data = clientData.get(socket);

    if (role === 'manager' || (role === 'guest' && key === 'role')) {
        const val = data.data[key];
        socket.write(`Value for key "${key}": "${val || '<blank>'}"\n`);
    } else {
        socket.write("Access denied.\n");
    }
}

function handlePut(socket, key, value) {
    const role = clientRoles.get(socket);
    const data = clientData.get(socket);

    if (role === 'manager' || (role === 'guest' && key !== 'role')) {
        data.data[key] = value;
        socket.write(`Key "${key}" set to "${value}"\n`);
    } else {
        socket.write("Access denied.\n");
    }
}

function upgradeToManager(socket) {
    // Only allow upgrade if the client is not already a manager
    if (clientRoles.get(socket) !== 'manager') {
        clientRoles.set(socket, 'manager');
        socket.write("You are now a manager.\n");
    } else {
        socket.write("You are already a manager.\n");
    }
}

function generateClientId() {
    return Math.floor(Math.random() * 1000);
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}.`);
});
