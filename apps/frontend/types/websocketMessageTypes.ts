export type messagesFromWebSocketServer = {
    type: "room-created",
    payload: {
        roomId: number,
        roomName: string
    }
} |
{
    type: "room-joined",
    payload: {
        roomId: number,
        roomName: string
    }
} |
{
    type: "room-left",
    payload: Record<string, never>
} |
{
    type: "user-joined",
    payload: {
        user: {
            id: number,
            username: string
        }
    }
} |
{
    type: "user-left",
    payload: {
        userId: number,
        username: string
    }
} |
{
    type: "new-message",
    payload: {
        userId: number,
        username: string,
        content: string
    }
} |
{
    type: "error",
    payload: {
        message: string
    }
} |
{
    type: "room-messages",
    payload: {
        messages: Array<{
            id: number;
            userId: number;
            username: string;
            content: string;
            timestamp: Date;
        }>;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalMessages: number;
            hasMore: boolean;
        };
    }
}

export type messagesToWebSocketServer = {
    type: 'join-room' | 'leave-room' | 'send-message' | 'create-room' | 'get-room-messages';
    payload: {
        roomId?: number;
        roomName?: string;
        content?: string;
        userId?: number;
        username?: string;
        page?: number;
        limit?: number;
    };
}

