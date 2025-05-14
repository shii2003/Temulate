import { useParams, useRouter } from "next/navigation";
import { resolve } from "path";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WS_URL = "ws://localhost:8080"

export const useWebSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ userId: number, username: string, content: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { roomNumber } = useParams();

    useEffect(() => {

        if (socket) return;

        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("Connected to WebSocket");
            if (roomNumber) {
                ws.send(JSON.stringify({
                    type: "join-room",
                    payload: {
                        roomName: roomNumber
                    }
                }))
            }
        }
        ws.onclose = () => console.log("Disconnected from WebSocket");
        ws.onerror = (error) => console.log("WebSocket Error:", error);

        ws.onmessage = (event) => {

            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            if (data.type === "new-message") {
                setMessages((prev) => [...prev, data.payload]);
            } else if (data.type === "room-created") {
                router.push(`/codeRooms/${data.payload.roomId}`);
            } else if (data.type === "room-joined") {
                router.push(`/codeRooms/${data.payload.roomId}`);
            } else if (data.type === "user-joined") {
                console.log(`${data.payload.user.username} joined the room.`);
            } else if (data.type === "user-left") {
                console.log(`${data.payload.user.username} left the room.`)
            }
        };

        setSocket(ws);

        return () => ws.close();
    }, [router]);

    const sendMessage = async (
        message: any,
        setLocalError: (error: string | null) => void = () => { }
    ) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            toast.error("WebSocket not connected");
            return;
        }

        setIsLoading(true);
        setLocalError(null);

        toast.promise(
            new Promise((resolve, reject) => {
                socket.send(JSON.stringify(message));

                const handleMessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);

                    if (["room-created", "room-joined", "new-message", "user-joined", "user-left"].includes(data.type)) {
                        resolve(data);
                    } else if (data.type === "error") {
                        reject(data.payload.message);
                    }

                    socket.removeEventListener("message", handleMessage);
                };
                socket.addEventListener("message", handleMessage);
            }),
            {
                loading: "Processing request...",
                success: (data: any) => {
                    if (data.type === "room-created") {
                        return `Room ${data.payload.roomName} created successfully!`;
                    } else if (data.type === "room-joined") {
                        return `Joined Room ${data.payload.roomName} successfully!`;
                    } else if (data.type === "new-message") {
                        return `${data.payload.username}: ${data.payload.content}`;
                    } else if (data.type === "user-joined") {
                        return `${data.payload.user.username} joined the room`;
                    } else if (data.type === "user-left") {
                        return `${data.payload.username} left the room`;
                    }
                    return "Success!";
                },
                error: (error: string) => {
                    setLocalError(error);
                    return error;
                },
                finally: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    const sendChatMessage = (content: string) => {
        if (!roomNumber) {
            toast.error("You are not currently in a room");
            return;
        }
        sendMessage(
            {
                type: "send-message",
                payload: { content, roomId: roomNumber },
            },

        )
    }
    return { socket, sendMessage, sendChatMessage, messages, isLoading };
};