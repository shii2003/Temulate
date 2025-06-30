import { addRoomMember, removeRoomMember, resetRoomState, setCurrentRoom, setRoomMembers } from "@/store/features/room/roomSlice";
import { RootState } from "@/store/store";
import { WebSocketManager } from "@/utils/WebSocketManager";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface User {
    id: number;
    username: string;
};

const WEBSOCKET_URL = "ws://localhost:8080";

export const useWebSocket = () => {

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const currentRoomIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!user) return;
        console.log("inside the useEffect of useWebSocket.ts")
        const ws = WebSocketManager.getInstance();
        ws.connect(WEBSOCKET_URL);

        const updateStatus = () => {
            setConnectionStatus(ws.isConnected() ? 'connected' : 'disconnected');
        };

        const handleRoomJoined = (data: { roomId: number; roomName: string }) => {
            dispatch(setCurrentRoom(data.roomId));
        }
        const handleRoomLeft = () => {
            dispatch(resetRoomState());
        }

        const handleRoomUsers = (data: User[]) => {
            dispatch(setRoomMembers(data));
        }

        const handleUserJoined = (data: { user: User }) => {
            dispatch(addRoomMember(data.user));
        }
        const handleUserLeft = (data: { userId: number; username: string }) => {
            dispatch(removeRoomMember(data.userId))
        }
        ws.on('connected', updateStatus);
        ws.on('disconnected', updateStatus);
        ws.on('room-joined', handleRoomJoined);
        ws.on('room-left', handleRoomLeft);
        ws.on('room-users', handleRoomUsers);
        ws.on('user-joined', handleUserJoined);
        ws.on('user-left', handleUserLeft);

        return () => {
            ws.off('connected', updateStatus);
            ws.off('disconnected', updateStatus);
            ws.off('room-joined', handleRoomJoined);
            ws.off('room-left', handleRoomLeft);
            ws.off('room-users', handleRoomUsers);
            ws.off('user-joined', handleUserJoined);
            ws.off('user-left', handleUserLeft);
        };
    }, [user, dispatch]);

    const sendCreateRoom = (name: string) => {
        WebSocketManager.getInstance().send("create-room", { name });
    };

    const sendJoinRoom = (roomName: string) => {
        WebSocketManager.getInstance().send("join-room", { roomName });
    };

    const sendLeaveRoom = () => {
        WebSocketManager.getInstance().send("leave-room", {});
    };

    const sendGetRoomUsers = (roomId: number) => {
        WebSocketManager.getInstance().send("get-room-users", { roomId })
    }
    const sendMessage = (content: string) => {
        WebSocketManager.getInstance().send("send-message", { content });
    };
    const sendDrawStart = (x: number, y: number, color: string, width: number, isEraser: boolean) => {
        WebSocketManager.getInstance().send("draw-start", { x, y, color, width, isEraser });
    };

    const sendDrawMove = (x: number, y: number, color: string, width: number, isEraser: boolean) => {
        WebSocketManager.getInstance().send("draw-move", { x, y, color, width, isEraser });
    };

    const sendDrawEnd = () => {
        WebSocketManager.getInstance().send("draw-end", {});
    };

    // Event handlers
    const onRoomCreated = (callback: (data: { roomId: number; roomName: string }) => void) => {
        WebSocketManager.getInstance().on("room-created", callback);
    };

    const onRoomJoined = (callback: (data: { roomId: number; roomName: string }) => void) => {
        WebSocketManager.getInstance().on("room-joined", callback);
    };

    const onRoomLeft = (callback: (data: {}) => void) => {
        WebSocketManager.getInstance().on("room-left", callback);
    };

    const onUserJoined = (callback: (data: { user: { id: number; username: string } }) => void) => {
        WebSocketManager.getInstance().on("user-joined", callback);
    };

    const onUserLeft = (callback: (data: { userId: number; username: string }) => void) => {
        WebSocketManager.getInstance().on("user-left", callback);
    };

    const onNewMessage = (callback: (data: { userId: number; username: string; content: string }) => void) => {
        WebSocketManager.getInstance().on("new-message", callback);
    };

    const onRoomUsers = (callback: (data: { users: { id: number; username: string }[] }) => void) => {
        WebSocketManager.getInstance().on('room-users', callback)
    };
    const onDrawStart = (callback: (data: { userId: number, x: number, y: number, color: string, width: number, isEraser: boolean }) => void) => {
        WebSocketManager.getInstance().on("draw-start", callback);
    };

    const onDrawMove = (callback: (data: { userId: number, x: number, y: number, color: string, width: number, isEraser: boolean }) => void) => {
        WebSocketManager.getInstance().on("draw-move", callback);
    };

    const onDrawEnd = (callback: (data: { userId: number }) => void) => {
        WebSocketManager.getInstance().on("draw-end", callback);
    };
    const onError = (callback: (data: { message: string }) => void) => {
        WebSocketManager.getInstance().on("error", callback);
    };

    // Cleanup handlers
    const offRoomCreated = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("room-created", callback);
    };

    const offRoomJoined = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("room-joined", callback);
    };

    const offNewMessage = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("new-message", callback);
    };

    const offUserJoined = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("user-joined", callback);
    };

    const offUserLeft = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("user-left", callback);
    };

    const offRoomUsers = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off('room-users', callback);
    };

    const offDrawStart = (callback: (data: { userId: number, x: number, y: number, color: string, width: number, isEraser: boolean }) => void) => {
        WebSocketManager.getInstance().off("draw-start", callback);
    };

    const offDrawMove = (callback: (data: { userId: number, x: number, y: number, color: string, width: number, isEraser: boolean }) => void) => {
        WebSocketManager.getInstance().off("draw-move", callback);
    };

    const offDrawEnd = (callback: (data: { userId: number }) => void) => {
        WebSocketManager.getInstance().off("draw-end", callback);
    };

    const offError = (callback: (data: any) => void) => {
        WebSocketManager.getInstance().off("error", callback);
    };

    const isConnected = () => {
        return WebSocketManager.getInstance().isConnected();
    };

    const disconnect = () => {
        WebSocketManager.getInstance().disconnect();
    };

    return {

        sendCreateRoom,
        sendJoinRoom,
        sendLeaveRoom,
        sendMessage,
        sendGetRoomUsers,
        sendDrawStart,
        sendDrawMove,
        sendDrawEnd,

        // Event handlers
        onRoomCreated,
        onRoomJoined,
        onRoomLeft,
        onUserJoined,
        onUserLeft,
        onNewMessage,
        onRoomUsers,
        onDrawStart,
        onDrawMove,
        onDrawEnd,
        onError,

        offRoomCreated,
        offRoomJoined,
        offUserLeft,
        offNewMessage,
        offUserJoined,
        offRoomUsers,
        offDrawStart,
        offDrawMove,
        offDrawEnd,
        offError,

        isConnected,
        disconnect,
    };
};