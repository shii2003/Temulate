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
        if (!this.rooms.has(roomId)) {
            this.createRoom(roomId, user);
        } else {
            this.rooms.get(roomId)?.push(user);
        }
    }
    public createRoom(roomId: number, user: User) {
        this.rooms.set(roomId, [user]);
    }
    getUsersInRoom(roomId: number): User[] | null {
        const usersInRoom = this.rooms.get(roomId);
        return usersInRoom || null;
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
        const users = this.rooms.get(roomId);
        if (!users) return;

        const updatedUsers = users.filter((u) => u.id !== user.id);
        if (updatedUsers.length === 0) {
            this.rooms.delete(roomId);
            console.log(`Room ${roomId} has been deleted because it's empty`);
        } else {
            this.rooms.set(roomId, updatedUsers);
        }
    }
    broadcastMessage(roomId: number, message: OutgoingMessage, excludeUser?: User) {
        const users = this.rooms.get(roomId);
        if (!users) return;

        users.forEach((user) => {
            if (excludeUser && user.id === excludeUser.id) return;
            user.send(message);
        });
    }
}