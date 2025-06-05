"use client";

import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type JoinRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastId, setToastId] = useState<string | number | null>(null);
    const toastIdRef = useRef<string | number | null>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const {
        sendJoinRoom,
        onRoomJoined,
        offRoomJoined,
        onError,
        offError,
        isConnected
    } = useWebSocket();

    const isRoomNameLengthValid = (name: string) => name.length <= 20;

    const handleRoomJoined = useCallback((data: { roomId: number; roomName: string }) => {
        console.log('Room Joined:', data);
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
        toast.success(`Joined room: ${data.roomName}`);
        setIsLoading(false);
        setError(null);
        onClose();
        router.push(`/codeRooms/${data.roomId}`);
    }, [onClose, router]);

    const handleError = useCallback((data: { message: string }) => {
        console.log('Error', data);
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
        toast.error(data.message);
        setError(data.message);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        onRoomJoined(handleRoomJoined);
        onError(handleError);

        return () => {
            offRoomJoined(handleRoomJoined);
            offError(handleError);
        };
    }, [isOpen, handleRoomJoined, handleError, onRoomJoined, offRoomJoined, onError, offError]);

    const handleJoinRoom = () => {
        setError(null);

        if (!user) {
            toast.error("Please login to join a room.");
            return;
        }

        if (!roomName.trim()) {
            toast.warning("Missing information", {
                description: 'Please enter a room name without spaces',
            })
            setError("please enter a room name.");
            return;
        }

        if (!isRoomNameLengthValid(roomName.trim())) {
            toast.warning("Invalid Input", {
                description: 'Room name must not be 20 characters or less.'
            });
            return;
        }

        if (!isConnected()) {
            toast.error('Connection Error', {
                description: 'Unable to connect to the server. Please try again later.'
            });
            return;
        }

        const id = toast.loading('Joining room...');
        setToastId(id);
        toastIdRef.current = id;
        setIsLoading(true);

        sendJoinRoom(roomName.trim());
    }

    useEffect(() => {
        if (!isOpen) {
            setRoomName("");
            setError(null);
            setIsLoading(false);
            if (toastId) {
                toast.dismiss(toastId);
                setToastId(null);
            }
            toastIdRef.current = null;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
            <div className='flex flex-col bg-neutral-800 rounded-md relative w-56 md:w-96 px-4 py-2'>
                <button
                    className='absolute top-2 right-2'
                    onClick={onClose}
                    disabled={isLoading}
                >
                    <IoClose
                        size={24}
                        className={`${isLoading ? 'text-gray-600' : 'text-red-500 hover:text-red-400'}`}
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
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                handleJoinRoom();
                            }
                        }}
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
                        disabled={!roomName.trim()}
                    // disabled={!isConnected || !roomName.trim()}
                    >
                        {isLoading ? "Joining..." : "Join Room"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomModal;

