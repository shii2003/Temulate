"use client";
import React, { useState } from 'react';
import CreateNewRoomButton from '../buttons/CreateNewRoomButton';
import CreateRoomModal from '../modals/CreateRoomModal';

type CreateNewRoomCardProps = {

};

const CreateNewRoomCard: React.FC<CreateNewRoomCardProps> = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className='w-56 flex flex-col gap-4 justify-center items-center border border-neutral-600 rounded-md bg-neutral-700 text-indigo-400 font-semibold bg-opacity-70 h-40'>
                <p className='text-xs underline font-thin text-neutral-500'>create you own code room here </p>
                <CreateNewRoomButton
                    onClick={() => setIsModalOpen(prev => !prev)}
                />
            </div>

            <CreateRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(prev => !prev)}
            />
        </>

    )
}
export default CreateNewRoomCard;