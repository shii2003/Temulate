"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type WebSocketContextType = {
    socket: WebSocket | null;
    connect: (url: string) => void;
    disconnect: () => void;
    send: (message: any) => void;
    isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    connect: () => { },
    disconnect: () => { },
    send: () => { },
    isConnected: false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = (url: string) => {
        console.log("Connecting to websocket.");

        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(url);
        socketRef.current = socket;

        const timeout = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                socket.close();
                setIsConnected(false);
                console.error("Connection timeout");
            }
        }, 5000);

        socket.onopen = () => {
            clearTimeout(timeout);
            setIsConnected(true);
            console.log("WebSocket connected");
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    const disconnect = () => {
        console.log("Disconnecting webSocket.")
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    const send = (message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{
            socket: socketRef.current,
            connect,
            disconnect,
            send,
            isConnected
        }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocketContext = () => useContext(WebSocketContext);