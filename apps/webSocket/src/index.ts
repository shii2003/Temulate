import { WebSocketServer, WebSocket } from "ws";

interface Room {
    name: string;
    clients: Set<WebSocket>;
}

const rooms: Map<string, Room> = new Map();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());

            switch (message.type) {
                case "create-room":
                    createRoom(message.roomName, ws);
                    break;
                case "join-room":
                    joinRoom(message.roomName, ws);
                    break;
                case "leave-room":
                    leaveRoom(message.roomName, ws);
                    break;
                case "send-message":
                    sendMessageToRoom(message.roomName, message.content, ws);
                    break;
                default:
                    ws.send(JSON.stringify({ error: "Invalid message type" }));
            }
        } catch (error) {
            console.error("Error processing message:", error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        removeClientFromAllRooms(ws);
    });
});

function createRoom(roomName: string, ws: WebSocket) {
    if (rooms.has(roomName)) {
        ws.send(JSON.stringify({ error: "Room already exists" }));
        return;
    }

    rooms.set(roomName, { name: roomName, clients: new Set([ws]) });
    ws.send(JSON.stringify({ success: `Room '${roomName}' created and joined` }));
}

function joinRoom(roomName: string, ws: WebSocket) {
    const room = rooms.get(roomName);
    if (!room) {
        ws.send(JSON.stringify({ error: "Room does not exist" }));
        return;
    }

    room.clients.add(ws);
    ws.send(JSON.stringify({ success: `Joined room '${roomName}'` }));
}

function leaveRoom(roomName: string, ws: WebSocket) {
    const room = rooms.get(roomName);
    if (!room) {
        ws.send(JSON.stringify({ error: "Room does not exist" }));
        return;
    }

    room.clients.delete(ws);
    ws.send(JSON.stringify({ success: `Left room '${roomName}'` }));

    // If the room is empty, delete it
    if (room.clients.size === 0) {
        rooms.delete(roomName);
    }
}

function sendMessageToRoom(roomName: string, content: string, ws: WebSocket) {
    const room = rooms.get(roomName);
    if (!room) {
        ws.send(JSON.stringify({ error: "Room does not exist" }));
        return;
    }

    for (const client of room.clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ roomName, content }));
        }
    }
}

function removeClientFromAllRooms(ws: WebSocket) {
    for (const [roomName, room] of rooms) {
        room.clients.delete(ws);

        // If the room is empty, delete it
        if (room.clients.size === 0) {
            rooms.delete(roomName);
        }
    }
}

console.log("WebSocket server is running on ws://localhost:8080");
