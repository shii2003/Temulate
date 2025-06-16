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
} | {
    type: "room-users",
    payload: {
        users: UserList[],
    }
}


export type IncomingMessage =
    | { type: 'create-room'; payload: { name: string } }
    | { type: 'join-room'; payload: { roomName: string } }
    | { type: 'leave-room'; payload: {} }
    | { type: 'send-message'; payload: { content: string } }
    | { type: 'get-room-users'; payload: { roomId: number } };