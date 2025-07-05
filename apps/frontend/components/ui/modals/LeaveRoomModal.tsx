import { useWebSocket } from '@/hooks/useWebSocket';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';

type LeaveRoomModalProps = {
    setIsLeaveRoomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({ setIsLeaveRoomOpen }) => {

    const [loading, setLoading] = useState(false);
    const {
        sendLeaveRoom,
        onRoomLeft,
        offRoomLeft,
        onError,
        offError,
        isConnected
    } = useWebSocket();

    const handleLeaveRoom = () => {
        setLoading(true);
        sendLeaveRoom();
    }
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
            <div className='flex flex-col gap-3 bg-neutral-800  w-96 text-neutral-300 rounded-md px-4 py-2'>
                <div className='flex items-center justify-end '>
                    <IoClose
                        onClick={() => setIsLeaveRoomOpen(false)}
                        size={24}
                        className='text-red-500  hover:text-red-400'
                    />
                </div>
                <div className='flex flex-col mb-3 px-2 gap-2'>
                    <p className='text-md font-semibold'>Are you sure you want to leave the room ? </p>
                    <p className='text-sm px-1'> Leaving the room will remove you from the room and you will have to join again.</p>
                </div>
                <div className='flex items-center justify-between px-4 mb-3'>
                    <button
                        className='flex items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50 w-20 '
                        onClick={() => {
                            setIsLeaveRoomOpen(false);
                            // toast.success("Your progress is saved successfully!");
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className='flex items-center justify-center px-3 py-2 rounded-md w-20 font-semibold border-neutral-700 border hover:bg-red-400/20 hover:text-white hover:border-red-500/20 bg-neutral-700/80'
                        onClick={() => setIsLeaveRoomOpen(false)}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}
export default LeaveRoomModal;