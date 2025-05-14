import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WS_URL = "ws://localhost:8080";

type RoomState = {
    roomId?: number;
    roomName?: string;
};

type WebSocketContextType = {
    socket: WebSocket | null;
    roomState: RoomState;
    messages: { userId: number; username: string; content: string }[];
    sendMessage: (message: any) => void;
    joinRoom: (roomName: string) => void;
    createRoom: (roomName: string) => void;
    leaveRoom: () => void;
    sendChatMessage: (content: string) => void;
    isLoading: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    roomState: {},
    messages: [],
    sendMessage: () => { },
    joinRoom: () => { },
    createRoom: () => { },
    leaveRoom: () => { },
    sendChatMessage: () => { },
    isLoading: false,
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomState, setRoomState] = useState<RoomState>({});
    const [messages, setMessages] = useState<{ userId: number; username: string; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (socketRef.current) return;

        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setSocket(ws);
        };

        ws.onclose = () => console.log("Disconnected from WebSocket");
        ws.onerror = (error) => console.log("WebSocket Error:", error);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            if (data.type === "new-message") {
                setMessages((prev) => [...prev, data.payload]);
            } else if (data.type === "room-created") {
                setRoomState({ roomId: data.payload.roomId, roomName: data.payload.roomName });
                router.push(`/codeRooms/${data.payload.roomId}`);
            } else if (data.type === "room-joined") {
                setRoomState({ roomId: data.payload.roomId, roomName: data.payload.roomName });
                router.push(`/codeRooms/${data.payload.roomId}`);
            } else if (data.type === "user-joined") {
                console.log(`${data.payload.user.username} joined the room.`);
            } else if (data.type === "user-left") {
                console.log(`${data.payload.user.username} left the room.`);
            } else if (data.type === "room-left") {
                setRoomState({});
                router.push("/");
            }
        };

        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, [router]);

    const sendMessage = async (message: any) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            toast.error("WebSocket not connected");
            return;
        }

        setIsLoading(true);
        socketRef.current.send(JSON.stringify(message));
        setIsLoading(false);
    };

    const joinRoom = (roomName: string) => {
        sendMessage({
            type: "join-room",
            payload: { roomName },
        });
    };

    const createRoom = (roomName: string) => {
        sendMessage({
            type: "create-room",
            payload: { name: roomName },
        });
    };

    const leaveRoom = () => {
        sendMessage({
            type: "leave-room",
            payload: {},
        });
    };

    const sendChatMessage = (content: string) => {
        if (!roomState.roomId) {
            toast.error("You are not currently in a room");
            return;
        }
        sendMessage({
            type: "send-message",
            payload: { content, roomId: roomState.roomId },
        });
    };

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                roomState,
                messages,
                sendMessage,
                joinRoom,
                createRoom,
                leaveRoom,
                sendChatMessage,
                isLoading,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
