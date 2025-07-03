import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./config";
import prisma from "@repo/db/client";
import { User } from "./User";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const HEARTBEAT_INTERVAL = 30000;

interface ExtendedWebSocket extends WebSocket {
    isAlive?: boolean;
    user?: User;
}

wss.on('connection', async (ws: ExtendedWebSocket, req) => {
    try {
        const cookies = parse(req.headers.cookie || "");
        const token = cookies.accessToken;

        if (!token) {
            ws.close(4001, "Unauthorized: No access token provided");
            console.log("invalid user tried to connect");
            return;
        }

        let decodedUser: JwtPayload;
        try {
            decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
        } catch (error) {
            console.error("Invalid or expired token:", error);
            ws.close(1008, "Unauthorized: Invalid or expired token");
            return;
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: decodedUser.userId },
            select: {
                id: true,
                email: true,
                username: true,
            }
        });

        if (!currentUser) {
            ws.close(4001, "Unauthorized: Invalid user");
            console.log("user not found");
            return;
        }

        console.log(`new User connected: ${currentUser.username}, ${currentUser.id}`);

        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });


        let user = new User(ws, currentUser.id, currentUser.username);

        ws.on('error', (error) => {
            console.log('An error occured.', error)
        })
        ws.on('close', () => {
            // user.destroy();
            const roomId = user.getRoomId();
            if (roomId) {
                RoomManager.getInstance().scheduleRoomDeletion(roomId);
            }
            console.log(`roomId ${roomId} is sceduled for deletion`);
        })
    } catch (error) {
        console.log("Error handling WebSocket connection:", error);
        ws.close(1011, "Internal Server Error");
    }
});

import { RoomManager } from "./RoomManager";
import { RedisManager } from "./RedisManager";


RedisManager.getInstance().subscribeToKeyExpiry((expiredKey) => {
    if (expiredKey.startsWith("room:delete:")) {
        const roomId = parseInt(expiredKey.split(":")[2], 10);

        const users = RoomManager.getInstance().getUsersInRoom(roomId);
        if (users) {
            users.forEach(user => user.destroy());
        }
        RoomManager.getInstance().removeRoom(roomId);
        console.log(`Room ${roomId} destroyed after 30 minutes of inactivity`);
    }
});

setInterval(() => {
    wss.clients.forEach((ws) => {

        const extWs = ws as ExtendedWebSocket;

        if (!extWs.isAlive) {
            console.log("Terminating dead connections");
            return extWs.terminate();
        }

        extWs.isAlive = false;
        extWs.ping();
    })
}, HEARTBEAT_INTERVAL);

console.log(`WebSocket server running on ws://localhost:${PORT}`);

