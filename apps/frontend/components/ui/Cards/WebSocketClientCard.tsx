'use client';
import { useEffect, useState } from "react";

export default function Chat() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === "message") {
                setMessages((prev) => [...prev, data.message]);
            }
        };

        return () => ws.close();
    }, []);

    const joinRoom = () => {
        if (socket && room) {
            socket.send(JSON.stringify({ action: "join", room }));
            setJoined(true);
        }
    };

    const sendMessage = () => {
        if (socket && message) {
            socket.send(JSON.stringify({ action: "message", message }));
            setMessage("");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            {!joined ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter room name"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="border p-2 w-full text-black"
                    />
                    <button
                        onClick={joinRoom}
                        className="bg-blue-500 text-white p-2 mt-2 w-full"
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                <div>
                    <div className="border p-2 h-64 overflow-auto mb-2">
                        {messages.map((msg, index) => (
                            <p key={index} className="p-1 border-b">{msg}</p>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border p-2 w-full text-black"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-green-500 text-white p-2 mt-2 w-full"
                    >
                        Send Message
                    </button>
                </div>
            )}
        </div>
    );
}
