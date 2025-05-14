import { useAppDispatch, useAppSelector } from '@/hooks/redux';


import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

type CreateRoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {

    const [roomName, setRoomName] = useState("");
    // const { createRoom, error, isConnected } = useWebSocket();

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (roomName.trim()) {
    //         createRoom(roomName.trim());
    //     }
    // }
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
                        className='px-4 py-2 bg-indigo-400 bg-opacity-70 hover:bg-opacity-30 text-neutral-200 font-semibold rounded-md'
                        onClick={onClose}
                    >
                        {/* {isConnected ? "Create Room" : "Creating..."} */}
                        Create Room
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