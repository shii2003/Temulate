import { User } from "./User";

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
            this.users.delete(userId);
            console.log(`UserManager: Removed user ${user.username} (ID: ${userId}). Total users: ${this.users.size}`);
        } else {
            console.warn(`UserManager: Attempted to remove non-existent user ID: ${userId}`);
        }
    }

    getUser(userId: number): User | undefined {
        return this.users.get(userId);
    }

}