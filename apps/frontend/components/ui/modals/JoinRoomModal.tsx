import { useWebSocket } from '@/hooks/useWebSocket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';

type JoinRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const { sendMessage, isLoading } = useWebSocket();

    useEffect(() => {
        if (!isOpen) {
            setRoomName("");
            setError(null);
        }
    }, [isOpen, setError]);

    const isRoomNameLengthValid = (name: string) => {
        if (name.length > 20) {
            return false;
        }
        return true;
    }

    const handleJoinRoom = () => {
        if (!roomName.trim()) return alert("Enter a room name!");
        if (!isRoomNameLengthValid(roomName.trim()))
            return toast.error("Room name should not be longer than 20 charachters!");

        sendMessage(
            {
                type: "join-room",
                payload: { roomName }
            },
            setError
        );

        if (!error) onClose();
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
                        {isLoading ? "Joining" : "Join Room"}
                    </button>

                </div>

            </div>
        </div>
    )
}
export default JoinRoomModal;