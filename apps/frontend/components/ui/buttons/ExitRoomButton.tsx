import React from 'react';
import { ImExit } from 'react-icons/im';

type ExitRoomButtonProps = {
    setIsLeaveRoomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExitRoomButton: React.FC<ExitRoomButtonProps> = ({ setIsLeaveRoomOpen }) => {

    return (
        <button
            className='flex items-center justify-center px-4 py-1  rounded-md hover:text-rose-500  border-2 font-semibold border-rose-500 hover:border-rose-600 hover:bg-rose-800/40 bg-rose-800/20 text-rose-500 gap-1 hover:scale-105 transition-all duration-200'
            onClick={() => setIsLeaveRoomOpen(true)}
        >
            <p className='hidden md:block'>Leave</p>
            <ImExit className='text-white block md:hidden' />
        </button>
    )
}
export default ExitRoomButton;