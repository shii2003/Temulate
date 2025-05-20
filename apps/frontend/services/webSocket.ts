export const CREATE_ROOM = 'create-room';
export const JOIN_ROOM = 'join-room';
export const LEAVE_ROOM = 'leave-room';
export const SEND_MESSAGE = 'send-message';

export const createRoom = (ws: WebSocket, roomName: string) => {
    if (ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: CREATE_ROOM,
                payload: { name: roomName }
            })
        )
    }
};

export const joinRoom = (ws: WebSocket, roomName: string) => {
    if (ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: JOIN_ROOM,
                payload: { roomName },
            })
        )
    }
}

export const leaveRoom = (ws: WebSocket) => {
    if (ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: LEAVE_ROOM,
                payload: {},
            })
        )
    }
}

export const sendMessage = (ws: WebSocket, content: string) => {
    if (ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: SEND_MESSAGE,
                payload: {
                    content
                }
            })
        )
    }
}