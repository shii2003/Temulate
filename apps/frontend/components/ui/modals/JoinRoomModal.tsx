"use client";

import { useWebSocket } from '@/components/providers/WebSocketProvider';
import { setRoomError } from '@/store/features/room/roomSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type JoinRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {

    const { createRoom, isConnected } = useWebSocket();
    const [roomName, setRoomName] = useState<string>("");
    const dispatch = useDispatch();
    const roomError = useSelector((state: RootState) => state.room.error);

    useEffect(() => {
        if (isOpen) {
            dispatch(setRoomError(null));
            setRoomName("");
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (roomError) {
            toast.error('Room Creation Failed', {
                description: roomError,
                action: {
                    label: 'Dismiss',
                    onClick: () => dispatch(setRoomError(null))
                },
            });
        }
    }, [roomError, dispatch]);



    const handleCreate = () => {
        if (!roomName.trim()) {
            toast.error('Invalid Room Name', {
                description: 'Room name cannot be empty.',
            });
            return;
        }
        if (roomName.trim().length > 20) {
            toast.error("Room name must not be more than 20 characters");
            return;
        }
        if (!isConnected) {
            toast.error('Connection Error', {
                description: 'WebSocket is not connected. Please try again.',
            });
            return;
        }
        createRoom(roomName);
        onClose();
    };

    const handleClose = () => {

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
            <div className='flex flex-col bg-neutral-800 rounded-md relative w-56 md:w-96 px-4 py-2'>
                <button
                    className='absolute top-2 right-2'
                    onClick={handleClose}
                // disabled={isLoading}
                >
                    <IoClose
                        size={24}
                        className='text-gray-600 hover:text-red-400'
                    // className={`${isLoading ? 'text-gray-600' : 'text-red-500 hover:text-red-400'}`}
                    />
                </button>

                <h2 className='mt-4 text-lg font-semibold text-neutral-400 tracking-wider'>Join Room</h2>
                <div className='mt-7'>
                    <input
                        type='text'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Enter room name'
                    // className='w-full px-3 py-2 rounded-md bg-neutral-700 text-white outline-none border-2 border-neutral-800 focus:border-indigo-400'
                    // disabled={isLoading}
                    />
                    <p className='text-xs text-neutral-500 mt-2'>
                        Do not add spaces to the name.
                    </p>
                    {/* {error && <p className='text-red-500'>{error}</p>} */}
                </div>
                <div className='mt-3 mb-4 flex justify-end'>
                    <button
                        onClick={handleCreate}
                        // className={`px-4 py-2 rounded-md bg-indigo-400 font-semibold tracking-wider ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        //     }`}
                        className='px-4 py-2 rounded-md bg-indigo-400 font-semibold tracking-wider'
                        disabled={!isConnected || !roomName.trim()}
                    >
                        Join
                        {/* {isLoading ? "Joining..." : "Join Room"} */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomModal;