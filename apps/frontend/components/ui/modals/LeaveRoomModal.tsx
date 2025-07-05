import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type LeaveRoomModalProps = {
    setIsLeaveRoomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({ setIsLeaveRoomOpen }) => {

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toastId, setToastId] = useState<string | number | null>(null);
    const toastIdRef = useRef<string | number | null>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const { currentRoomId } = useSelector((state: RootState) => state.room);
    const router = useRouter();

    const {
        sendLeaveRoom,
        onRoomLeft,
        offRoomLeft,
        onError,
        offError,
        isConnected
    } = useWebSocket();

    const handleRoomLeft = useCallback(() => {
        console.log('Room left successfully');
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
        toast.success('Successfully left the room');
        setIsLoading(false);
        setError(null);

        setIsLeaveRoomOpen(false);
        router.push('/menu');
    }, [setIsLeaveRoomOpen, router]);

    const handleError = useCallback((data: { message: string }) => {
        console.log('Error leaving room:', data);
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
        toast.error(data.message);
        setError(data.message);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        onRoomLeft(handleRoomLeft);
        onError(handleError);

        return () => {
            offRoomLeft(handleRoomLeft);
            offError(handleError);
        };
    }, [handleRoomLeft, handleError, onRoomLeft, offRoomLeft, onError, offError]);

    const handleLeaveRoom = () => {
        setError(null);
        setIsLoading(true);

        if (!user) {
            toast.error("User not logged in.");
            setIsLoading(false);
            return;
        }

        if (!isConnected()) {
            toast.error('Connection Error', {
                description: 'Unable to connect to the server. Please try again later.'
            });
            setIsLoading(false);
            return;
        }

        if (!currentRoomId) {
            toast.error('Room not found', {
                description: 'You are not in a room. Please join a room to leave.'
            });
            setIsLoading(false);
            return;
        }

        const id = toast.loading("Leaving room...");
        setToastId(id);
        toastIdRef.current = id;
        setIsLoading(true);

        sendLeaveRoom();
    };

    useEffect(() => {

        return () => {
            setError(null);
            if (toastId) {
                toast.dismiss(toastId);
                setToastId(null);
            }
            toastIdRef.current = null;
        };
    }, [toastId]);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
            <div className='flex flex-col gap-3 bg-neutral-800  w-96 text-neutral-300 rounded-md px-4 py-2'>
                <div className='flex items-center justify-end '>
                    <IoClose
                        onClick={() => !isLoading && setIsLeaveRoomOpen(false)}
                        size={24}
                        className={`${isLoading ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400 cursor-pointer'}`}
                    />
                </div>
                <div className='flex flex-col mb-3 px-2 gap-2'>
                    <p className='text-md font-semibold'>Are you sure you want to leave the room?</p>
                    <p className='text-sm px-1'>Leaving the room will remove you from the room and you will have to join again.</p>
                    {error && <p className='text-red-500 text-sm px-1'>{error}</p>}
                </div>
                <div className='flex items-center justify-between px-4 mb-3'>
                    <button
                        className={`flex items-center justify-center px-3 py-2 rounded-md font-semibold text-white w-20 ${isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-indigo-400/80 hover:bg-indigo-400/50'
                            }`}
                        onClick={handleLeaveRoom}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Leaving...' : 'Yes'}
                    </button>
                    <button
                        className={`flex items-center justify-center px-3 py-2 rounded-md w-20 font-semibold border ${isLoading
                            ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                            : 'border-neutral-700 hover:bg-red-400/20 hover:text-white hover:border-red-500/20 bg-neutral-700/80'
                            }`}
                        onClick={() => !isLoading && setIsLeaveRoomOpen(false)}
                        disabled={isLoading}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}
export default LeaveRoomModal;