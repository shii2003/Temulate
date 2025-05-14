"use client";

import { useState } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import { toast } from "sonner";

export const CreateAndEnterRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { createRoom, isLoading } = useWebSocket();

    const handleCreateRoom = () => {
        if (!roomName.trim()) return toast.error("Please enter a room name!")

        createRoom(roomName);
    };

    return (
        <div className="p-4 bg-neutral-700 rounded-md">
            <input
                type="text"
                placeholder="Enter Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="px-3 py-2 border rounded-md bg-gray-700 text-white"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-2">
                <button
                    onClick={handleCreateRoom}
                    className="px-4 py-2 bg-indigo-300 rounded-md mr-2"
                    disabled={isLoading}
                >
                    Create Room
                </button>
            </div>
        </div>
    )
}