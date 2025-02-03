import { OutgoingMessage } from "./types/types";
import { User } from "./User";

export class RoomManager {
    private static instance: RoomManager;
    private rooms: Map<number, User[]>;

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    addRoom(roomId: number, user: User) {
        this.rooms.set(roomId, [user]);
    }

    async addUserToRoom(roomId: number, user: User) {
        const room = this.rooms.get(roomId);
        if (!room) {
            user.send({ type: "error", payload: { message: "Room does not exist" } });
            return;
        }
        if (room.length >= 10) {
            user.send({ type: "error", payload: { message: "Room is full" } });
            return;
        }
        room.push(user);
        this.rooms.set(roomId, room);
    }
    removeUser(user: User, roomId: number) {
        if (!this.rooms.has(roomId)) return;
        this.rooms.set(roomId, this.rooms.get(roomId)!.filter((u) => u.id !== user.id));
    }
    broadcastMessage(roomId: number, message: OutgoingMessage, excludeUser?: User) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.forEach((user) => {
            if (excludeUser && user.id === excludeUser.id) return;
            user.send(message);
        });
    }
}