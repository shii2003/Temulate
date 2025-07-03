import prisma from "@repo/db/client";
import { WebSocket } from "ws";
import { OutgoingMessage } from "./types/types";
import { RoomManager } from "./RoomManager";
import { MessageManager } from "./MessageManager";

export const CREATE_ROOM = 'create-room';
export const JOIN_ROOM = 'join-room';
export const LEAVE_ROOM = 'leave-room';
export const SEND_MESSAGE = 'send-message';
export const GET_ROOM_USERS = 'get-room-users';
export const DRAW_START = 'draw-start';
export const DRAW_MOVE = 'draw-move';
export const DRAW_END = 'draw-end';

export class User {
    public id: number;
    public username: string;
    private ws: WebSocket;
    private roomId?: number;
    private lastStrokeColor: string | null = null;
    private lastStrokeWidth: number | null = null;
    private lastStrokeIsEraser: boolean = false;

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
                        console.log(`create-room request received from ${this.username} ${this.id}.`);
                        await this.handleCreateRoom(parsedData.payload.name);
                        break;
                    case JOIN_ROOM:
                        console.log(`join-room request received from ${this.username} ${this.id}.`);
                        await this.handleJoinRoom(parsedData.payload.roomName);
                        break;
                    case LEAVE_ROOM:
                        console.log(`leave-room request received from ${this.username} ${this.id}.`);
                        await this.handleLeaveRoom();
                        break;
                    case SEND_MESSAGE:
                        console.log(`send-messasge request received from ${this.username} ${this.id}.`);
                        await this.handleSendMessage(parsedData.payload.content);
                        break;
                    case GET_ROOM_USERS:
                        console.log(`get-room-users request received from ${this.username} ${this.username}.`);
                        if (!this.roomId) {
                            console.log(`roomId is not available roomId: ${this.roomId}.`);
                        }
                        else if (this.roomId) {
                            await this.getRoomUsers(this.roomId);
                        }
                        break;
                    case DRAW_START:
                        console.log(`draw-start request received from user ${this.username}.`);
                        await this.handleDrawStart(
                            parsedData.payload.x,
                            parsedData.payload.y,
                            parsedData.payload.color,
                            parsedData.payload.width,
                        );
                        break;
                    case DRAW_MOVE:
                        console.log(`draw-move request received from user ${this.id}.`);
                        await this.handleDrawMove(
                            parsedData.payload.x,
                            parsedData.payload.y,
                        );
                        break;
                    case DRAW_END:
                        console.log(`draw-end request received from user ${this.id}.`);
                        await this.handleDrawEnd();
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
            await RoomManager.getInstance().createOrAddUserToRoom(room.id, this);
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

            const usersInRoom = RoomManager.getInstance().getUsersInRoom(room.id);

            if (usersInRoom) {
                RoomManager.getInstance().broadcastMessage(
                    room.id,
                    {
                        type: 'room-users',
                        payload: {
                            users: usersInRoom.map(user => ({
                                id: user.id,
                                username: user.username,
                            }))
                        }
                    }
                );
            }
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

            const usersInRoom = RoomManager.getInstance().getUsersInRoom(room.id);
            if (usersInRoom) {

                RoomManager.getInstance().broadcastMessage(
                    room.id,
                    {
                        type: 'room-users',
                        payload: {
                            users: usersInRoom.map(user => ({
                                id: user.id,
                                username: user.username,
                            }))
                        }
                    },
                    this
                )

                this.send({
                    type: 'room-users',
                    payload: {
                        users: usersInRoom.map(user => ({
                            id: user.id,
                            username: user.username,
                        }))
                    }
                })
            }


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
            console.log(`user: ${this.username} joined room ${room.id}`);
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
            console.log(`User left room: username=${this.username}, userId=${this.id}, roomId=${roomId}`);
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
                }
            );
            const usersInRoom = RoomManager.getInstance().getUsersInRoom(roomId);
            if (usersInRoom) {
                RoomManager.getInstance().broadcastMessage(
                    roomId,
                    {
                        type: 'room-users',
                        payload: {
                            users: usersInRoom.map(user => ({
                                id: user.id,
                                username: user.username,
                            }))
                        }
                    }
                );
            }
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
            console.log(`user: ${this.username} sent the message successfully ${content}`)
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

    private async getRoomUsers(roomId: number) {
        try {
            if (!roomId) {
                this.send({
                    type: 'error',
                    payload: {
                        message: 'userId is not given'
                    }
                })
                return;
            }
            const users = RoomManager.getInstance().getUsersInRoom(roomId);

            if (users) {
                this.send(
                    {
                        type: 'room-users',
                        payload: {
                            users: users.map(user => ({
                                id: user.id,
                                username: user.username,
                            }))
                        }
                    }
                )
                return;
            }
            if (!users) return null;

        } catch (error) {
            this.send(
                {
                    type: 'error',
                    payload: {
                        message: "Not currently in a room"
                    }
                }
            )
        }
    }

    private async handleDrawStart(x: number, y: number, color: string, width: number) {
        if (!this.roomId) {
            this.send({
                type: "error",
                payload: {
                    message: `user: ${this.username} is not currently in a room.`
                }
            })
            return;
        }

        this.lastStrokeColor = color;
        this.lastStrokeWidth = width;
        this.lastStrokeIsEraser = color === '#171717';

        try {
            RoomManager.getInstance().broadcastMessage(
                this.roomId,
                {
                    type: 'draw-start',
                    payload: {
                        userId: this.id,
                        x,
                        y,
                        color,
                        width,
                        isEraser: this.lastStrokeIsEraser
                    }
                },
                this
            );

            await prisma.drawingAction.create({
                data: {
                    roomId: this.roomId,
                    userId: this.id,
                    type: 'start',
                    x, y, color, width
                }
            });
        } catch (error) {
            console.log(`error in handleDrawStart function for userId: ${this.id}`)
            this.send(
                {
                    type: "error",
                    payload: {
                        message: "an error occured."
                    }
                }
            );
        }
    }

    private async handleDrawMove(x: number, y: number) {
        if (!this.roomId) {
            this.send({
                type: "error",
                payload: {
                    message: `user: ${this.username} is not currently in a room.`
                }
            })
            return;
        }

        try {
            RoomManager.getInstance().broadcastMessage(
                this.roomId,
                {
                    type: 'draw-move',
                    payload: {
                        userId: this.id,
                        x,
                        y,
                        color: this.lastStrokeColor,
                        width: this.lastStrokeWidth,
                        isEraser: this.lastStrokeIsEraser,
                    }
                },
                this
            );

            await prisma.drawingAction.create({
                data: {
                    roomId: this.roomId,
                    userId: this.id,
                    type: 'move',
                    x, y
                }
            });
        } catch (error) {
            console.log(`error in handleDrawMove function for userId: ${this.id}`)
            this.send(
                {
                    type: "error",
                    payload: {
                        message: "an error occured."
                    }
                }
            )
        }
    }

    private async handleDrawEnd() {
        if (!this.roomId) {
            this.send({
                type: "error",
                payload: {
                    message: `user: ${this.username} is not currently in a room.`
                }
            })
            return;
        }

        try {
            RoomManager.getInstance().broadcastMessage(
                this.roomId,
                {
                    type: 'draw-end',
                    payload: { userId: this.id }
                },
                this
            );

            await prisma.drawingAction.create({
                data: {
                    roomId: this.roomId,
                    userId: this.id,
                    type: 'end'
                }
            });
        } catch (error) {
            console.log(`error in handleDrawEnd function for userId: ${this.id}`)
            this.send(
                {
                    type: "error",
                    payload: {
                        message: "an error occured."
                    }
                }
            )
        }
    }


    destroy() {
        console.log(`inside user.destroy function user: ${this.username}`);
        if (this.roomId) {
            const roomId = this.roomId;
            RoomManager.getInstance().broadcastMessage(roomId, {
                type: 'user-left',
                payload: {
                    userId: this.id,
                    username: this.username,
                }
            }, this);
            RoomManager.getInstance().removeUser(this, this.roomId);
            console.log(`User destroyed and left room: username=${this.username}, userId=${this.id}, roomId=${roomId}`);

            const usersInRoom = RoomManager.getInstance().getUsersInRoom(roomId);
            if (usersInRoom) {
                RoomManager.getInstance().broadcastMessage(
                    roomId,
                    {
                        type: 'room-users',
                        payload: {
                            users: usersInRoom.map(user => ({
                                id: user.id,
                                username: user.username,
                            }))
                        }
                    }
                );
            }
        }
    }

    public send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }

    public getRoomId(): number | undefined {
        return this.roomId;
    }
}