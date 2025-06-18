export type UserList = {
    id: number,
    username: string,
}

export type OutgoingMessage = {
    type: "room-created",
    payload: {
        roomId: number,
        roomName: string
    }
} | {
    type: "room-joined",
    payload: {
        roomId: number,
        roomName: string
    }
} | {
    type: "room-left",
    payload: Record<string, never>
} | {
    type: "user-joined",
    payload: {
        user: {
            id: number,
            username: string
        }
    }
} | {
    type: "user-left",
    payload: {
        userId: number,
        username: string
    }
} | {
    type: "new-message",
    payload: {
        userId: number,
        username: string,
        content: string
    }
} | {
    type: "room-users",
    payload: {
        users: UserList[],
    }
} | {
    type: 'draw-start',
    payload: {
        userId: number,
        x: number,
        y: number,
        color: string,
        width: number
    }
} | {
    type: 'draw-move',
    payload:
    {
        userId: number,
        x: number,
        y: number
    }
} | {
    type: 'draw-end',
    payload: { userId: number }
} | {
    type: "error",
    payload: {
        message: string
    }
};

export type IncomingMessage =
    | { type: 'create-room'; payload: { name: string } }
    | { type: 'join-room'; payload: { roomName: string } }
    | { type: 'leave-room'; payload: {} }
    | { type: 'send-message'; payload: { content: string } }
    | { type: 'get-room-users'; payload: { roomId: number } }
    | { type: 'draw-start'; payload: { x: number, y: number, color: string, width: number } }
    | { type: 'draw-move'; payload: { x: number, y: number } }
    | { type: 'draw-end'; payload: {} };