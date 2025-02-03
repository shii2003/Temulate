import prisma from "@repo/db/client";

export class MessageManager {
    private static instace: MessageManager;

    private constructor() { };

    public static getInstance(): MessageManager {
        if (!this.instace) {
            this.instace = new MessageManager();
        }
        return this.instace;
    }

    async sendMessage(roomId: number, userId: number, content: string) {
        await prisma.message.create({
            data: { roomId, userId, content },
        });
    }
}