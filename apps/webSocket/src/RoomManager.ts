import { RedisManager } from "./RedisManager";
import { OutgoingMessage } from "./types/types";
import { User } from "./User";
import prisma from "@repo/db/client";

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

    async scheduleRoomDeletion(roomId: number) {
        await RedisManager.getInstance().setKeyWithExpiry(`room:delete:${roomId}`, "1", 30 * 60);
        console.log(`Room ${roomId} scheduled for deletion in 30 minutes`);
    }

    async cancelRoomDeletion(roomId: number) {
        await RedisManager.getInstance().delKey(`room:delete:${roomId}`);
        console.log(`Room ${roomId} deletion cancelled`);
    }

    public removeRoom(roomId: number) {
        this.rooms.delete(roomId);
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
        console.log(`current rooms: ${JSON.stringify(this.rooms)}`);
        console.log(`usersInRoom ${roomId}: ${usersInRoom}`);
        return usersInRoom || null;
    }
    async addUserToRoom(roomId: number, user: User) {
        await this.cancelRoomDeletion(roomId);
        let room = this.rooms.get(roomId);
        if (!room) {
            user.send({ type: "error", payload: { message: "Room does not exist" } });
            return;
        }
        if (room.length >= 10) {
            user.send({ type: "error", payload: { message: "Room is full" } });
            return;
        }

        room = room.filter((u) => u.id !== user.id);
        room.push(user);
        this.rooms.set(roomId, room);
    }

    async createOrAddUserToRoom(roomId: number, user: User) {
        console.log(`current rooms: ${JSON.stringify(this.rooms)}*******************************`);
        let room = this.rooms.get(roomId);
        if (!room) {

            this.createRoom(roomId, user);
        } else {

            if (room.length >= 10) {
                user.send({ type: "error", payload: { message: "Room is full" } });
                return;
            }

            room = room.filter((u) => u.id !== user.id);
            room.push(user);
            this.rooms.set(roomId, room);
        }

    }
    removeUser(user: User, roomId: number) {
        const users = this.rooms.get(roomId);
        if (!users) return;

        const updatedUsers = users.filter((u) => u.id !== user.id);
        if (updatedUsers.length === 0) {
            this.scheduleRoomDeletion(roomId);
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

    /**
     * Synchronize room state from database
     * This method should be called on server startup or when recovering from inconsistencies
     */
    async syncRoomFromDatabase(roomId: number): Promise<boolean> {
        try {
            const room = await prisma.room.findUnique({
                where: { id: roomId },
                include: {
                    members: {
                        include: { user: true }
                    }
                }
            });

            if (!room) {
                console.log(`Room ${roomId} not found in database, removing from memory`);
                this.rooms.delete(roomId);
                return false;
            }

            // If room exists in database but not in memory, create it
            if (!this.rooms.has(roomId)) {
                this.rooms.set(roomId, []);
                console.log(`Room ${roomId} recreated in memory from database`);
            }

            return true;
        } catch (error) {
            console.error(`Error syncing room ${roomId} from database:`, error);
            return false;
        }
    }

    async validateRoomConsistency(roomId: number): Promise<boolean> {
        try {
            const inMemoryUsers = this.rooms.get(roomId) || [];
            const dbMembers = await prisma.roomUser.findMany({
                where: { roomId },
                include: { user: true }
            });

            const inMemoryUserIds = new Set(inMemoryUsers.map(u => u.id));
            const dbUserIds = new Set(dbMembers.map(m => m.userId));

            const orphanedUsers = inMemoryUsers.filter(u => !dbUserIds.has(u.id));
            if (orphanedUsers.length > 0) {
                console.warn(`Room ${roomId} has orphaned users in memory:`, orphanedUsers.map(u => u.username));
                // Remove orphaned users from memory
                const validUsers = inMemoryUsers.filter(u => dbUserIds.has(u.id));
                this.rooms.set(roomId, validUsers);
            }

            // Check for users in database but not in memory (these are offline users)
            const offlineUsers = dbMembers.filter(m => !inMemoryUserIds.has(m.userId));
            if (offlineUsers.length > 0) {
                console.log(`Room ${roomId} has ${offlineUsers.length} offline users in database`);
            }

            return true;
        } catch (error) {
            console.error(`Error validating room ${roomId} consistency:`, error);
            return false;
        }
    }

    async recoverFromInconsistency(roomId: number): Promise<boolean> {
        try {
            console.log(`Attempting to recover room ${roomId} from inconsistency`);

            // Clear current in-memory state
            this.rooms.delete(roomId);

            // Rebuild from database
            const success = await this.syncRoomFromDatabase(roomId);

            if (success) {
                console.log(`Room ${roomId} recovered successfully`);
            } else {
                console.log(`Room ${roomId} could not be recovered`);
            }

            return success;
        } catch (error) {
            console.error(`Error recovering room ${roomId}:`, error);
            return false;
        }
    }

    getRoomStats() {
        const stats = {
            totalRooms: this.rooms.size,
            totalUsers: Array.from(this.rooms.values()).reduce((sum, users) => sum + users.length, 0),
            rooms: Array.from(this.rooms.entries()).map(([roomId, users]) => ({
                roomId,
                userCount: users.length,
                usernames: users.map(u => u.username)
            }))
        };

        return stats;
    }

    cleanupEmptyRooms() {
        const emptyRooms = Array.from(this.rooms.entries())
            .filter(([_, users]) => users.length === 0)
            .map(([roomId, _]) => roomId);

        emptyRooms.forEach(roomId => {
            this.rooms.delete(roomId);
            this.scheduleRoomDeletion(roomId);
            console.log(`Cleaned up empty room ${roomId}`);
        });

        return emptyRooms.length;
    }
} 