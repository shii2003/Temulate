import { RootState } from "@/store/store";
import { WebSocketManager } from "@/utils/WebSocketManager";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const WEBSOCKET_URL = "ws://localhost:8080";

export const useWebSocket = () => {

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

    const user = useSelector((state: RootState) => state.auth.user);
    const currentRoomIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!user) return;
        console.log("inside the useEffect of useWebSocket.ts")
        const ws = WebSocketManager.getInstance();
        ws.connect(WEBSOCKET_URL);

        const updateStatus = () => {
            setConnectionStatus(ws.isConnected() ? 'connected' : 'disconnected');
        };

        ws.on('connected', updateStatus);
        ws.on('disconnected', updateStatus);

        return () => {
            ws.off('connected', updateStatus);
            ws.off('disconnected', updateStatus);
        };
    }, [user]);

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
    }
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

        // Event handlers
        onRoomCreated,
        onRoomJoined,
        onRoomLeft,
        onUserJoined,
        onUserLeft,
        onNewMessage,
        onRoomUsers,
        onError,

        offRoomCreated,
        offRoomJoined,
        offUserLeft,
        offNewMessage,
        offUserJoined,
        offRoomUsers,
        offError,

        isConnected,
        disconnect,
    };
};