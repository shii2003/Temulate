"use client";
import React, { useState } from 'react';
import { FaLongArrowAltRight } from "react-icons/fa";
import JoinRoomModal from '../modals/JoinRoomModal';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type JoinRoomCardProps = {

};

const JoinRoomCard: React.FC<JoinRoomCardProps> = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleOpen = () => {
        if (!user) {
            toast.warning('Authentication Required', {
                description: 'Please login to join a room',
                action: {
                    label: 'Dismiss',
                    onClick: () => { }
                },
            });
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            <div className='flex justify-center items-center w-56 h-40 border border-neutral-700 rounded-md bg-gradient-to-b from-indigo-400 to-indigo-200'>
                <button
                    onClick={handleOpen}
                    className="flex justify-center items-center gap-2 border border-indigo-300 px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-800 
             transform transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                >
                    <p className="text-neutral-400 font-semibold transition duration-300">Join room</p>
                    <FaLongArrowAltRight size={28} className="text-indigo-400 transition duration-300" />
                </button>


            </div>
            <JoinRoomModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(prev => !prev);
                    toast.dismiss();
                }}
            />
        </>
    )
}
export default JoinRoomCard;