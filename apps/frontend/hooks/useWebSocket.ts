import { useWebSocketContext } from "@/components/providers/WebSocketProvider";
import { addMessage, addUser, clearChat, removeUser } from "@/store/features/chat/chatSlice";
import { setLoading, setRoom } from "@/store/features/room/roomSlice";
import { RootState } from "@/store/store";
import webSocketManager from "@/utils/WebSocketManager";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useWebSocket = (roomId?: number) => {

    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleMessage = (data: any) => {
            console.log("WebSocket message:", data);

            switch (data.type) {
                case 'room-created':
                    dispatch(setLoading(false));
                    dispatch(setRoom({
                        id: data.payload.roomId,
                        name: data.payload.roomName,
                    }));
                    toast.success(`Created room ${data.payload.roomName}`);
                    router.push(`/codeRooms/${data.payload.roomId}`);
                    break;
                case 'room-joined':
                    dispatch(setLoading(false));
                    dispatch(setRoom({
                        id: data.payload.roomId,
                        name: data.payload.roomName,
                    }));
                    toast.success(`Joined room ${data.payload.roomName}`);
                    router.push(`/codeRooms/${data.payload.roomId}`);
                    break;
                case 'user-joined':
                    dispatch(addUser(data.payload.user));
                    toast.info(`User ${data.payload.user.username} joined`);
                    break;
                case 'user-left':
                    dispatch(removeUser(data.payload.userId));
                    toast.info(`${data.payload.username} left the room`);
                    break;
                case 'room-left':
                    dispatch(clearChat());
                    toast.info("You left the room");
                    break;
                case 'new-message':
                    dispatch(addMessage({
                        content: data.payload.content,
                        userId: data.payload.userId,
                        username: data.payload.username,

                    }));
                    break;
                case 'error':
                    dispatch(setLoading(false));
                    toast.error(`${data.payload.message}`);
                    setError(data.payload.message);
                    if (data.payload.code === 'ROOM_NOT_FOUND') {
                        router.push('/');
                    }
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        };

        webSocketManager.onMessage(handleMessage);

        return () => {
            webSocketManager.close();
        };
    }, [dispatch, router]);

    const connectAndSend = (payload: any) => {
        try {
            setError(null);
            dispatch(setLoading(true));

            webSocketManager.connect("ws://localhost:8080");
            setIsConnected(true);

            webSocketManager.send(JSON.stringify(payload));
            return true;
        } catch (err) {
            console.error("Failed to connect/send:", err);
            dispatch(setLoading(false));
            toast.error("Failed to connect to server");
            setError("Failed to connect to server");
            return false;
        }
    };

    const joinRoom = (roomName: string) => {
        if (!user) {
            toast.error("Please login to join a room.");
            setError("Please login to join a room.");
            return false;
        }

        if (!roomName.trim()) {
            toast.warning("Please enter a room name.");
            setError("Please enter a room name.");
            return false;
        }

        if (roomName.trim().length > 20) {
            toast.warning("Room name should be less than 20 characters.");
            setError("Room name should be less than 20 characters.");
            return false;
        }

        return connectAndSend({
            type: "join-room",
            payload: {
                roomName: roomName.trim(),
                userId: user.id,
                username: user.username,
            },
        });
    };

    const createRoom = (roomName: string) => {
        if (!user) {
            toast.error("Please login to create a room.");
            setError("Please login to create a room.");
            return false;
        }

        if (!roomName.trim()) {
            toast.warning("Please enter a room name.");
            setError("Please enter a room name.");
            return false;
        }

        if (roomName.trim().length > 20) {
            toast.warning("Room name should be less than 20 characters.");
            setError("Room name should be less than 20 characters.");
            return false;
        }

        return connectAndSend({
            type: "create-room",
            payload: {
                name: roomName.trim(),
                userId: user.id,
                username: user.username,
            },
        });
    };

    const leaveRoom = () => {
        if (roomId) {
            webSocketManager.send(JSON.stringify({
                type: "leave-room",
                payload: { roomId },
            }));
        }
        webSocketManager.close();
        setIsConnected(false);
    };

    const sendMessage = (data: any) => {
        webSocketManager.send(JSON.stringify(data));
    };

    return {
        joinRoom,
        createRoom,
        leaveRoom,
        sendMessage,
        isConnected,
        error,
        setError,
    };
};