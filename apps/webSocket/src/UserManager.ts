import { User } from "./User";
import { RoomManager } from "./RoomManager";

export class UserManager {

    private static instance: UserManager;
    private users: Map<number, User>; //stores UserId: User.

    private constructor() {
        this.users = new Map();
    }

    public static getInstance(): UserManager {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    addUser(user: User) {
        this.users.set(user.id, user);
        console.log(`UserManager: Added user ${user.username} (ID: ${user.id}). Total users: ${this.users.size}`);
    }

    removeUser(userId: number) {
        const user = this.users.get(userId);
        if (user) {
            // Clean up user from all rooms before removing
            const roomId = user.getRoomId();
            if (roomId) {
                RoomManager.getInstance().removeUser(user, roomId);
            }

            this.users.delete(userId);
            console.log(`UserManager: Removed user ${user.username} (ID: ${userId}). Total users: ${this.users.size}`);
        } else {
            console.warn(`UserManager: Attempted to remove non-existent user ID: ${userId}`);
        }
    }

    getUser(userId: number): User | undefined {
        return this.users.get(userId);
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    getUserStats() {
        const users = this.getAllUsers();
        const usersInRooms = users.filter(user => user.getRoomId() !== undefined);

        return {
            totalUsers: this.users.size,
            usersInRooms: usersInRooms.length,
            usersNotInRooms: this.users.size - usersInRooms.length,
            usernames: users.map(u => u.username)
        };
    }

    cleanupDisconnectedUsers() {
        const disconnectedUsers: number[] = [];

        this.users.forEach((user, userId) => {
            // Check if WebSocket connection is still open
            if (user['ws'].readyState === 3) { // WebSocket.CLOSED
                disconnectedUsers.push(userId);
            }
        });

        disconnectedUsers.forEach(userId => {
            console.log(`Cleaning up disconnected user ID: ${userId}`);
            this.removeUser(userId);
        });

        return disconnectedUsers.length;
    }

    /**
     * Force remove a user (for error recovery)
     */
    forceRemoveUser(userId: number) {
        const user = this.users.get(userId);
        if (user) {
            // Force cleanup without normal room leaving process
            const roomId = user.getRoomId();
            if (roomId) {
                // Notify other users that this user left unexpectedly
                RoomManager.getInstance().broadcastMessage(
                    roomId,
                    {
                        type: 'user-left',
                        payload: {
                            userId: user.id,
                            username: user.username
                        }
                    }
                );

                // Remove from room
                RoomManager.getInstance().removeUser(user, roomId);
            }

            this.users.delete(userId);
            console.log(`UserManager: Force removed user ${user.username} (ID: ${userId})`);
        }
    }
}