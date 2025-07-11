export type OutgoingMessage =
    | { type: "create-room"; payload: { name: string } }
    | { type: "join-room"; payload: { roomName: string } }
    | { type: "leave-room"; payload: {} }
    | { type: "send-message"; payload: { content: string } }
    | { type: "get-room-messages"; payload: { page: number; limit: number } };

export type IncomingMessage =
    | { type: "room-created"; payload: RoomCreatedPayload }
    | { type: "room-joined"; payload: RoomJoinedPayload }
    | { type: "user-joined"; payload: UserJoinedPayload }
    | { type: "user-left"; payload: UserLeftPayload }
    | { type: "new-message"; payload: NewMessagePayload }
    | { type: "room-left"; payload: {} }
    | { type: "room-messages"; payload: RoomMessagesPayload }
    | { type: "error"; payload: { message: string } };

export interface RoomCreatedPayload {
    roomId: number;
    roomName: string;
}

export interface RoomJoinedPayload {
    roomId: number;
    roomName: string;
}

export interface UserJoinedPayload {
    user: {
        id: number;
        username: string;
    };
}

export interface UserLeftPayload {
    userId: number;
    username: string;
    reason?: string;
}

export interface NewMessagePayload {
    userId: number;
    username: string;
    content: string;
}

export interface RoomMessagesPayload {
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
