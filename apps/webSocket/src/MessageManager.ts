import prisma from "@repo/db/client";

export class MessageManager {
    private static instance: MessageManager;

    private constructor() { };

    public static getInstance(): MessageManager {
        if (!this.instance) {
            this.instance = new MessageManager();
        }
        return this.instance;
    }

    async sendMessage(roomId: number, userId: number, content: string) {
        try {
            await prisma.message.create({
                data: { roomId, userId, content },
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            throw error;
        }
    }
}