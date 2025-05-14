"use client";
import Workspace from '@/components/CodeRooms/WorkSpace/Workspace';
import DrawingCanvas from '@/components/GameRoom/DrawingCanvas';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface PageProps {
    params: {
        roomNumber: string;
    }
}

const page: React.FC<PageProps> = ({ params }) => {

    const { roomid } = useParams();
    const { sendMessage, socket } = useWebSocket();
    const [messages, setMessages] = useState<{ userId: number; username: string; content: string }[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "new-message") {
                setMessages((prev) => [...prev, data.payload]);
            }
        };
    }, [socket]);

    const sendChatMessage = () => {
        if (!message.trim()) return;

        sendMessage({
            type: "send-message",
            payload: { content: message }
        });

        setMessage("");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Game Room {roomid}</h1>
            <div className="mt-4 p-2 bg-gray-800 rounded-lg h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 border-b border-gray-600">
                        <strong>{msg.username}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-gray-700 text-white"
                    placeholder="Type a message..."
                />
                <button onClick={sendChatMessage} className="ml-2 px-4 py-2 bg-blue-500 rounded-md">Send</button>
            </div>
        </div>
    );
}
export default page;