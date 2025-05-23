import { addMessage, removeUser } from "@/store/features/chat/chatSlice";
import { setRoom } from "@/store/features/room/roomSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useWebSocket = (url: string, roomId: number) => {

    const [ws, setWs] = useState<WebSocket | null>(null);
    const webSocketRef = useRef<WebSocket | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const dispatch = useDispatch();



    useEffect(() => {

        const socket = new WebSocket(url);
        webSocketRef.current = socket;
        setWs(socket);

        socket.onopen = () => {
            console.log("websocket connected");
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'user-left':
                    dispatch(removeUser(data.payload.userId));
                    toast.info(`${data.payload.user.username} joined the room`);
                    break;
                case 'new-message':
                    dispatch(addMessage({
                        content: data.payload.content,
                        userId: data.payload.userId,
                        username: data.pyaload.userName,
                        timestamp: new Date().toISOString()
                    }));
                    break;
                case 'error':
                    toast.error(data.payload.message);
                    if (data.payload.code === 'ROOM_NOT_FOUND') {
                        router.push('/');
                    }
                    break;
            }
        };

        socket.onclose = () => {
            toast.info(`Disconnected from the room`);
        };

        socket.onerror = (error) => {
            toast.error('WebSocket error occured');
            console.error('WebSocket error:', error);
        }

        return () => {
            if (webSocketRef.current?.readyState === WebSocket.OPEN) {
                webSocketRef.current.send(JSON.stringify({
                    type: 'leave-room',
                    payload: { roomId },
                }));
                webSocketRef.current.close();
            }
        };

    }, [url, roomId, dispatch, user, router]);

    const sendMessage = (content: string) => {
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify({
                type: 'send-message',
                payload: {
                    roomId,
                    content
                }
            }))
        }
    }

    return {
        ws,
        sendMessage,
        isConnected: ws?.readyState === WebSocket.OPEN
    };
};