"use client";
import React, { useState } from 'react';
import { FaLongArrowAltRight } from "react-icons/fa";
import JoinRoomModal from '../modals/JoinRoomModal';

type JoinRoomCardProps = {

};

const JoinRoomCard: React.FC<JoinRoomCardProps> = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className='flex justify-center items-center w-56 h-40 border border-neutral-700 rounded-md bg-gradient-to-b from-indigo-400 to-indigo-200'>
                <button
                    className='flex  justify-center items-center gap-2 border border-indigo-300 px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700'
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <p className='text-neutral-400 font-semibold'>Join room</p>
                    <FaLongArrowAltRight size={28} className='text-indigo-400' />
                </button>

            </div>
            <JoinRoomModal
                isOpen={isOpen}
                onClose={() => setIsOpen(prev => !prev)}
            />
        </>
    )
}
export default JoinRoomCard;