const WebSocket = require("ws");

const onlineUsers = new Map();

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        const userId = req.url.split("?id=")[1];
        onlineUsers.set(userId, ws);

        ws.on("message", (data) => {
            const { sender, receiver, content } = JSON.parse(data);
            const receiverSocket = onlineUsers.get(receiver);

            if (receiverSocket) {
                receiverSocket.send(JSON.stringify({ sender, content }));
            } else {
                console.log(`User ${receiver} is offline. Message stored for later.`);
            }
        });

        ws.on("close", () => {
            onlineUsers.delete(userId);
        });
    });
};

module.exports = setupWebSocket;
