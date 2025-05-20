import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useWebSocket } from '@/hooks/useWebSocket';
import { setLoading } from '@/store/features/room/roomSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type CreateRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();
    const ws = useWebSocket("ws://localhost:8080");
    const { isLoading } = useSelector((state: RootState) => state.room);
    const { user } = useSelector((state: RootState) => state.auth);
    const [toastId, setToastId] = useState<string | number | undefined>(undefined);

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
                if (message.type === "error") {
                    toast.dismiss(toastId);
                    toast.error(message.payload.message);
                    dispatch(setLoading(false));

                } else if (message.type === "room-created") {
                    toast.dismiss(toastId);
                    toast.success(`Created room: ${message.payload.roomName}`);
                    dispatch(setLoading(false));
                    onClose();
                    router.push(`/codeRooms/${message.payload.roomId}`);
                }
            } catch (error) {
                console.error(error);
            }
        };

        ws.addEventListener('message', handleMessage);
        return () => ws.removeEventListener('message', handleMessage);
    }, [ws, toastId, dispatch, onClose]);

    const handleCreateRoom = () => {

        if (!user) {
            toast.error("Please login to join a room");
        }

        if (!roomName.trim()) {
            toast.warning("Missing information", {
                description: 'Please enter a room name without space',
            });
            return;
        }

        if (!isRoomNameLengthValid(roomName.trim())) {
            toast.warning('Invalid  Input', {
                description: 'Room name must be 20 characters or less',
            });
            return;
        }

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            toast.error('Connection Error', {
                description: 'Unable to connect to the server. Please try again later.'
            });
            return;
        }

        const id = toast.loading('Joining room...');
        setToastId(id);
        dispatch(setLoading(true));

        ws.send(JSON.stringify({
            type: "create-room",
            payload: {
                name: roomName.trim(),
            }
        }));
    }

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 '>
            <div className=' flex  flex-col  gap-3 bg-neutral-800 p-6 rounded-lg w-96 relative'>
                <button
                    className='absolute top-2 right-2 text-neutral-400 hover:text-white'
                    onClick={onClose}
                >
                    <IoClose size={24} className='text-red-500 hover:text-red-400' />
                </button>

                <h2 className='text-lg font-semibold text-neutral-400'>Create new Room</h2>

                <div className='mt-4'>
                    <input
                        type='text'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Enter room name'
                        className='w-full px-3 py-2 rounded-md bg-neutral-700 text-white outline-none border-2 border-neutral-800 focus:border-indigo-400'
                    // disabled={!isConnected}
                    />
                    <p className='text-xs text-neutral-500 mt-2'>
                        the room name should not match any other room's name
                    </p>

                </div>

                <div className='mt-2 flex justify-end'>
                    <button
                        onClick={handleCreateRoom}
                        className='px-4 py-2 bg-indigo-400 bg-opacity-70 hover:bg-opacity-30 text-neutral-200 font-semibold rounded-md'
                    >
                        {isLoading ? "Create Room" : "Creating..."}

                    </button>
                    {/* {error && (
                        <div className='text-red-500 text-sm mt-2'>
                            {error}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}
export default CreateRoomModal;