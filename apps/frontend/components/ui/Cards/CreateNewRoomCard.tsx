"use client";
import React, { useState } from 'react';
import CreateNewRoomButton from '../buttons/CreateNewRoomButton';
import CreateRoomModal from '../modals/CreateRoomModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

type CreateNewRoomCardProps = {

};

const CreateNewRoomCard: React.FC<CreateNewRoomCardProps> = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(true);
    }

    return (
        <>
            <div className='w-56 flex flex-col gap-4 justify-center items-center border border-neutral-600 rounded-md bg-neutral-700 text-indigo-400 font-semibold bg-opacity-70 h-40'>
                <p className='text-xs underline font-thin text-neutral-500'>create you own code room here </p>
                <CreateNewRoomButton
                    onClick={handleOpen}
                />
            </div>

            <CreateRoomModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(prev => !prev);
                    toast.dismiss();
                }}
            />
        </>

    )
}
export default CreateNewRoomCard;