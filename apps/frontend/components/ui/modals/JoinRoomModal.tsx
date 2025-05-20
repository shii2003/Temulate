"use client";
import { useWebSocket } from '@/hooks/useWebSocket';
import { joinRoom } from '@/services/webSocket';
import { setLoading } from '@/store/features/room/roomSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type JoinRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();
    const ws = useWebSocket("ws://localhost:8080");
    const { isLoading } = useSelector((state: RootState) => state.room);
    const { user } = useSelector((state: RootState) => state.auth);
    const [toastId, setToastId] = useState<string | number | null>(null);


    const isRoomNameLengthValid = (name: string) => {
        if (name.length > 20) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'error') {
                    toast.dismiss(toastId);
                    toast.error(message.payload.message);
                    dispatch(setLoading(false));
                }

                if (message.type === 'room-joined') {
                    toast.dismiss(toastId);
                    toast.success(`Joined room: ${message.payload.roomName}`);
                    dispatch(setLoading(false));
                    onClose();
                    router.push(`/codeRooms/${message.payload.roomId}`);
                }
            } catch (error) {
                console.error('Message parsing error:', error);
            }
        };

        ws.addEventListener('message', handleMessage);
        return () => ws.removeEventListener('message', handleMessage);
    }, [ws, toastId, dispatch, onClose]);


    const handleJoinRoom = () => {

        if (!user) {
            toast.error("Please login to join a room");
            return;
        }

        if (!roomName.trim()) {
            toast.warning("Missing Information", {
                description: 'Please enter a room name',
            });
            return;
        }
        if (!isRoomNameLengthValid(roomName.trim())) {
            toast.warning('Invalid Input', {
                description: 'Room name must be 20 characters or less',
            });
            return;
        }
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            toast.error('Connection Error', {
                description: 'Unable to connect to the server. Please try again later.',
            });
            return;
        }

        const id = toast.loading('Joining room...');
        setToastId(id);
        dispatch(setLoading(true));

        ws.send(JSON.stringify({
            type: 'join-room',
            payload: {
                roomName: roomName.trim(),
            }
        }));
    }

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 '>
            <div className=' flex flex-col bg-neutral-800 rounded-md  relative w-56 md:w-96 px-4 py-2'>
                <button
                    className=' absolute top-2 right-2'
                    onClick={onClose}
                >
                    <IoClose
                        size={24}
                        className='text-red-500 hover:text-red-400'
                    />
                </button>

                <h2 className='mt-4 text-lg font-semibold text-neutral-400 tracking-wider'>Join Room</h2>
                <div className='mt-7'>
                    <input
                        type='text'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Enter room name'
                        className='w-full px-3 py-2 rounded-md bg-neutral-700 text-white outline-none border-2 border-neutral-800 focus:border-indigo-400'
                    />
                    <p className='text-xs text-neutral-500 mt-2'>
                        Do not add spaces to the name.
                    </p>
                    {error && <p className='text-red-500'>{error}</p>}
                </div>
                <div className='mt-3 mb-4 flex justify-end'>
                    <button
                        onClick={handleJoinRoom}
                        className={`px-4 py-2 rounded-md bg-indigo-400 font-semibold tracking-wider ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Joining..." : "Join Room"}
                    </button>

                </div>

            </div>
        </div>
    )
}
export default JoinRoomModal;