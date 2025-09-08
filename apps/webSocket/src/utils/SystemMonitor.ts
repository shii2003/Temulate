import { RoomManager } from "../RoomManager";
import { UserManager } from "../UserManager";
import prisma from "@repo/db/client";

export class SystemMonitor {
    private static instance: SystemMonitor;
    private cleanupInterval: NodeJS.Timeout | null = null;
    private validationInterval: NodeJS.Timeout | null = null;

    private constructor() { }

    public static getInstance(): SystemMonitor {
        if (!this.instance) {
            this.instance = new SystemMonitor();
        }
        return this.instance;
    }


    startMonitoring() {
        console.log("Starting system monitoring...");


        this.cleanupInterval = setInterval(async () => {
            await this.performCleanup();
        }, 5 * 60 * 1000);

        this.validationInterval = setInterval(async () => {
            await this.validateSystemConsistency();
        }, 10 * 60 * 1000);

        console.log("System monitoring started");
    }


    stopMonitoring() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }

        if (this.validationInterval) {
            clearInterval(this.validationInterval);
            this.validationInterval = null;
        }

        console.log("System monitoring stopped");
    }

    private async performCleanup() {
        try {
            console.log("Performing system cleanup...");

            const roomManager = RoomManager.getInstance();
            const userManager = UserManager.getInstance();

            const disconnectedCount = userManager.cleanupDisconnectedUsers();
            console.log(`Cleaned up ${disconnectedCount} disconnected users`);

            const emptyRoomsCount = roomManager.cleanupEmptyRooms();
            console.log(`Cleaned up ${emptyRoomsCount} empty rooms`);


            const roomStats = roomManager.getRoomStats();
            const userStats = userManager.getUserStats();

            console.log("System Stats:", {
                rooms: roomStats,
                users: userStats
            });

        } catch (error) {
            console.error("Error during system cleanup:", error);
        }
    }

    private async validateSystemConsistency() {
        try {
            console.log("Validating system consistency...");

            const roomManager = RoomManager.getInstance();
            const roomStats = roomManager.getRoomStats();

            // Validate each room
            for (const room of roomStats.rooms) {
                const isValid = await roomManager.validateRoomConsistency(room.roomId);
                if (!isValid) {
                    console.warn(`Room ${room.roomId} has consistency issues, attempting recovery...`);
                    await roomManager.recoverFromInconsistency(room.roomId);
                }
            }

            console.log("System consistency validation completed");

        } catch (error) {
            console.error("Error during consistency validation:", error);
        }
    }


    async getSystemHealthReport() {
        try {
            const roomManager = RoomManager.getInstance();
            const userManager = UserManager.getInstance();

            const roomStats = roomManager.getRoomStats();
            const userStats = userManager.getUserStats();

            const dbStats = await this.getDatabaseStats();

            return {
                timestamp: new Date().toISOString(),
                memory: {
                    rooms: roomStats,
                    users: userStats
                },
                database: dbStats,
                health: {
                    status: this.calculateHealthStatus(roomStats, userStats, dbStats),
                    issues: await this.identifyIssues(roomStats, userStats, dbStats)
                }
            };
        } catch (error) {
            console.error("Error generating health report:", error);
            return {
                timestamp: new Date().toISOString(),
                error: "Failed to generate health report",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    private async getDatabaseStats() {
        try {
            const [roomCount, userCount, messageCount, drawingActionCount] = await Promise.all([
                prisma.room.count(),
                prisma.user.count(),
                prisma.message.count(),
                prisma.drawingAction.count()
            ]);

            return {
                rooms: roomCount,
                users: userCount,
                messages: messageCount,
                drawingActions: drawingActionCount
            };
        } catch (error) {
            console.error("Error getting database stats:", error);
            return { error: "Failed to get database stats" };
        }
    }

    private calculateHealthStatus(roomStats: any, userStats: any, dbStats: any) {
        const issues = [];

        if (roomStats.totalRooms === 0 && userStats.totalUsers > 0) {
            issues.push("Users connected but no rooms in memory");
        }

        if (userStats.totalUsers === 0 && roomStats.totalUsers > 0) {
            issues.push("Rooms have users but no users in memory");
        }

        if (dbStats.error) {
            issues.push("Database connection issues");
        }

        if (issues.length === 0) {
            return "healthy";
        } else if (issues.length <= 2) {
            return "warning";
        } else {
            return "critical";
        }
    }

    private async identifyIssues(roomStats: any, userStats: any, dbStats: any) {
        const issues = [];

        if (roomStats.totalRooms > 100) {
            issues.push("High number of rooms in memory - possible memory leak");
        }

        if (userStats.totalUsers > 1000) {
            issues.push("High number of users in memory - possible memory leak");
        }

        if (dbStats.rooms && roomStats.totalRooms !== dbStats.rooms) {
            issues.push(`Room count mismatch: memory=${roomStats.totalRooms}, database=${dbStats.rooms}`);
        }

        return issues;
    }

    async forceRecovery() {
        console.log("Forcing system recovery...");

        try {
            const roomManager = RoomManager.getInstance();
            const userManager = UserManager.getInstance();

            const dbRooms = await prisma.room.findMany({
                select: { id: true }
            });

            for (const room of dbRooms) {
                await roomManager.recoverFromInconsistency(room.id);
            }

            userManager.cleanupDisconnectedUsers();

            console.log("System recovery completed");
            return true;
        } catch (error) {
            console.error("Error during system recovery:", error);
            return false;
        }
    }
}
