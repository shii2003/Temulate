"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    username: string;
}

interface Message {
    userId: number;
    username: string;
    content: string;
}

interface IncomingMessage {
    type: string;
    payload: any;
}

const page: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [roomName, setRoomName] = useState('');
    const [joinedRoom, setJoinedRoom] = useState(false);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            toast.success('Connected to the server');
        };

        socket.onmessage = (event) => {
            const incomingMessage: IncomingMessage = JSON.parse(event.data);

            switch (incomingMessage.type) {
                case 'user-joined':
                    setUsers((prevUsers) => [...prevUsers, incomingMessage.payload.user]);
                    toast.success(`${incomingMessage.payload.user.username} joined the room`);
                    break;
                case 'user-left':
                    setUsers((prevUsers) =>
                        prevUsers.filter((user) => user.id !== incomingMessage.payload.userId)
                    );
                    toast(`${incomingMessage.payload.username} left the room`);
                    break;
                case 'new-message':
                    setMessages((prevMessages) => [...prevMessages,
                    {
                        userId: incomingMessage.payload.userId,
                        username: incomingMessage.payload.username,
                        content: incomingMessage.payload.content
                    }]
                    );
                    toast(`${incomingMessage.payload.username}: ${incomingMessage.payload.content}`);
                    break;
                case 'room-created':
                    setJoinedRoom(true);
                    toast.success(`Room "${incomingMessage.payload.roomName}" created successfully`);
                    break;
                case 'room-joined':
                    setJoinedRoom(true);
                    toast.success(`Joined room "${incomingMessage.payload.roomName}"`);
                    break;
                case 'room-left':
                    setJoinedRoom(false);
                    toast('You have left the room');
                    break;
                case 'error':
                    toast.error(incomingMessage.payload.message);
                    break;
                default:
                    console.warn('Unknown message type:', incomingMessage.type);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            toast.error('WebSocket error occurred');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            toast('Disconnected from the server');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const createRoom = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'create-room',
                    payload: { name: roomName },
                })
            );
        } else {
            toast.error('WebSocket connection is not open');
        }
    };

    const joinRoom = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'join-room',
                    payload: { roomName },
                })
            );
        } else {
            toast.error('WebSocket connection is not open');
        }
    };

    const leaveRoom = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'leave-room',
                })
            );
        } else {
            toast.error('WebSocket connection is not open');
        }
    };

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'send-message',
                    payload: { content: messageInput },
                })
            );
            setMessageInput('');
        } else {
            toast.error('WebSocket connection is not open');
        }
    };

    return (
        <div className='text-green-500'>
            <h1>Chat Room</h1>
            <div>
                <h2>Active Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>{message.username}:</strong> {message.content}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button onClick={createRoom}>Create Room</button>
                <button onClick={joinRoom} disabled={joinedRoom}>
                    Join Room
                </button>
                <button onClick={leaveRoom} disabled={!joinedRoom}>
                    Leave Room
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={sendMessage} disabled={!joinedRoom}>
                    Send Message
                </button>
            </div>
        </div>
    );
};

export default page;