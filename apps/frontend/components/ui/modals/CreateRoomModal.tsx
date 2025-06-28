import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type CreateRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastId, setToastId] = useState<string | number | null>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const {
        sendCreateRoom,
        onRoomCreated,
        offRoomCreated,
        onError,
        offError,
        isConnected
    } = useWebSocket();

    const isRoomNameLengthValid = (name: string) => name.length <= 20;

    const handleRoomCreated = useCallback((data: { roomId: number; roomName: string }) => {
        console.log('Room created:', data);
        if (toastId) toast.dismiss(toastId);
        toast.success(`Created room: ${data.roomName}`);
        setIsLoading(false);
        setError(null);
        onClose();
        router.push(`/room/${data.roomId}`);
    }, [toastId, onClose, router]);

    const handleError = useCallback((data: { message: string }) => {
        console.log('Error:', data);
        if (toastId) toast.dismiss(toastId);
        toast.error(data.message);
        setError(data.message);
        setIsLoading(false);
    }, [toastId]);

    useEffect(() => {
        if (!isOpen) return;

        onRoomCreated(handleRoomCreated);
        onError(handleError);

        return () => {
            offRoomCreated(handleRoomCreated);
            offError(handleError);
        };
    }, [isOpen, handleRoomCreated, handleError, onRoomCreated, offRoomCreated, onError, offError]);

    const handleCreateRoom = () => {
        setError(null);

        if (!user) {
            toast.error("Please login to create a room");
            return;
        }

        if (!roomName.trim()) {
            toast.warning("Missing information", {
                description: 'Please enter a room name without spaces',
            });
            return;
        }

        if (!isRoomNameLengthValid(roomName.trim())) {
            toast.warning('Invalid Input', {
                description: 'Room name must be 20 characters or less.',
            });
            return;
        }

        if (!isConnected()) {
            toast.error('Connection Error', {
                description: 'Unable to connect to the server. Please try again later.'
            });
            return;
        }

        const id = toast.loading('Creating room...');
        setToastId(id);
        setIsLoading(true);

        sendCreateRoom(roomName.trim());
    }

    useEffect(() => {
        if (!isOpen) {
            setRoomName("");
            setError(null);
            setIsLoading(false);
            toastId && toast.dismiss(toastId);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
            <div className='flex flex-col gap-3 bg-neutral-800 p-6 rounded-lg w-96 relative'>
                <button
                    className='absolute top-2 right-2 text-neutral-400 hover:text-white'
                    onClick={onClose}
                    disabled={isLoading}
                >
                    <IoClose
                        size={24}
                        className={`${isLoading ? 'text-gray-600' : 'text-red-500 hover:text-red-400'}`}
                    />
                </button>

                <h2 className='text-lg font-semibold text-neutral-400'>Create new Room</h2>

                <div className='mt-4'>
                    <input
                        type='text'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Enter room name'
                        className='w-full px-3 py-2 rounded-md bg-neutral-700 text-white outline-none border-2 border-neutral-800 focus:border-indigo-400'
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                handleCreateRoom();
                            }
                        }}
                    />
                    <p className='text-xs text-neutral-500 mt-2'>
                        The room name should not match any other room's name
                    </p>
                    {error && (
                        <div className='text-red-500 text-sm mt-2'>
                            {error}
                        </div>
                    )}
                </div>

                <div className='mt-2 flex justify-end'>
                    <button
                        onClick={handleCreateRoom}
                        disabled={!roomName.trim() || isLoading}
                        className={`px-4 py-2 bg-indigo-400 bg-opacity-70 hover:bg-opacity-30 text-neutral-200 font-semibold rounded-md transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? "Creating..." : "Create Room"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateRoomModal;
