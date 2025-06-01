import prisma from "@repo/db/client";
import { WebSocket } from "ws";
import { OutgoingMessage } from "./types/types";
import { RoomManager } from "./RoomManager";
import { MessageManager } from "./MessageManager";

export const CREATE_ROOM = 'create-room';
export const JOIN_ROOM = 'join-room';
export const LEAVE_ROOM = 'leave-room';
export const SEND_MESSAGE = 'send-message';

export class User {
    public id: number;
    public username: string;
    private ws: WebSocket;
    private roomId?: number;

    constructor(ws: WebSocket, id: number, username: string) {
        this.id = id;
        this.username = username;
        this.ws = ws;
        this.initHandlers();
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            try {
                const parsedData = JSON.parse(data.toString());

                switch (parsedData.type) {
                    case CREATE_ROOM:
                        console.log(`create-room request received from ${this.username} ${this.id}`)
                        await this.handleCreateRoom(parsedData.payload.name);
                        break;
                    case JOIN_ROOM:
                        console.log(`join-room request received from ${this.username} ${this.id}`)
                        await this.handleJoinRoom(parsedData.payload.roomName);
                        break;
                    case LEAVE_ROOM:
                        console.log(`leave-room request received from ${this.username} ${this.id}`)
                        await this.handleLeaveRoom();
                        break;
                    case SEND_MESSAGE:
                        console.log(`send-messasge request received from ${this.username} ${this.id}`)
                        await this.handleSendMessage(parsedData.payload.content);
                        break;
                    default:
                        console.warn("Unknown message type", parsedData.type);
                        this.send(
                            {
                                type: "error",
                                payload: { message: "Unknown message type" }
                            }
                        );
                }
            } catch (error) {
                console.error("Error processing message:", error);
                this.send(
                    {
                        type: "error",
                        payload: { message: "Internal Server error" }
                    });
            }
        });
    }

    private async handleCreateRoom(name: string) {
        try {
            const existingRoom = await prisma.room.findUnique({
                where: { name },
            });
            if (existingRoom) {
                console.log(`Room with name '${name} already exists`);
                this.send(
                    {
                        type: 'error',
                        payload: {
                            message: 'Room name already exists please choose another name'
                        }
                    }
                );
                return;
            }
            const room = await prisma.room.create({
                data: {
                    name,
                    ownerId: this.id,
                    members: {
                        create: {
                            userId: this.id,
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    members: {
                        select: {
                            id: true,
                            userId: true,
                        }
                    }
                },
            });
            console.log(`room created roomid: ${room.id} room name: ${room.name}`)
            RoomManager.getInstance().addRoom(room.id, this);
            this.roomId = room.id;
            console.log(`current room: ${this.roomId}`)

            this.send(
                {
                    type: 'room-created',
                    payload: {
                        roomId: room.id,
                        roomName: room.name
                    }
                }
            );
        } catch (error) {
            console.log("Error creating room:", error);
            this.send(
                {
                    type: 'error',
                    payload: { message: 'Failed to create room' }
                }
            );
        }
    }

    private async handleJoinRoom(roomName: string) {
        try {
            const room = await prisma.room.findUnique({
                where: { name: roomName },
                include: { members: true },
            });

            if (!room) {
                console.log(`the room which the user: ${this.username} is trying to access does not exit`)

                this.send(
                    {
                        type: 'error',
                        payload: { message: 'Room does not exist' }
                    }
                );
                return;
            }
            const isMember = room.members.some((member) => member.userId === this.id);

            if (!isMember) {
                await prisma.roomUser.create({
                    data: {
                        userId: this.id,
                        roomId: room.id,
                    }
                });
            }
            await RoomManager.getInstance().addUserToRoom(room.id, this);
            this.roomId = room.id;

            console.log(`user: ${this.username} joined the room: ${this.roomId} (${roomName}).`)

            this.send(
                {
                    type: 'room-joined',
                    payload: {
                        roomId: room.id,
                        roomName: room.name,
                    }
                }
            );

            console.log(`user: ${this.username} joined room ${room.id}`)

            RoomManager.getInstance().broadcastMessage(
                room.id,
                {
                    type: 'user-joined',
                    payload: {
                        user: {
                            id: this.id,
                            username: this.username
                        }
                    }
                },
                this
            );
        } catch (error) {
            console.error("Error joining room:", error);
            this.send({ type: 'error', payload: { message: 'Failed to join room' } });
        }
    }

    private async handleLeaveRoom() {
        if (this.roomId) {
            const roomId = this.roomId;
            await prisma.roomUser.deleteMany({
                where: {
                    userId: this.id,
                    roomId: roomId,
                },
            });

            RoomManager.getInstance().removeUser(this, this.roomId);
            console.log(`user: ${this.username} successfully left the room: ${this.roomId}`)
            this.roomId = undefined;

            console.log(`roomId ${roomId}`)
            this.send({ type: 'room-left', payload: {} });

            RoomManager.getInstance().broadcastMessage(
                roomId,
                {
                    type: 'user-left',
                    payload: {
                        userId: this.id,
                        username: this.username
                    }
                },
                this
            );

        } else {
            this.send(
                {
                    type: 'error',
                    payload: {
                        message: 'Not currently in a room'
                    }
                }
            );
        }
    }

    private async handleSendMessage(content: string) {
        try {
            if (!this.roomId) {
                console.log(`User ${this.username} is not in a room. Current roomId:  ${this.roomId}`)
                this.send({
                    type: "error",
                    payload: {
                        message: "Not currently in a room"
                    }
                });
                return;
            }

            const message = await MessageManager.getInstance().sendMessage(this.roomId, this.id, content);

            RoomManager.getInstance().broadcastMessage(
                this.roomId,
                {
                    type: 'new-message',
                    payload: {
                        userId: this.id,
                        username: this.username,
                        content: content
                    },
                }
            );
            console.log(`user: ${this.username} sent the message successfully ${message}`)
        } catch (error) {
            this.send(
                {
                    type: 'error',
                    payload: {
                        message: "unable to send message"
                    }
                }
            )
        }

    }

    destroy() {
        if (this.roomId) {
            RoomManager.getInstance().removeUser(this, this.roomId)
        }
    }

    public send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
}