import React from 'react';
import { MdOutlineAdd } from 'react-icons/md';

type CreateNewRoomButtonProps = {
    onClick: () => void;
};

const CreateNewRoomButton: React.FC<CreateNewRoomButtonProps> = ({ onClick }) => {

    return (
        <button
            className='flex items-center  justify-center gap-2 px-2 py-2 border border-neutral-700 rounded-md bg-neutral-800
             transform transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer'
            onClick={onClick}
        >
            <p className="text-neutral-400 font-semibold transition duration-300">Add new room</p>
            <MdOutlineAdd
                style={{ fontSize: '27px' }}
                className='text-indigo-300 transition duration-300'
            />
        </button>
    )
}
export default CreateNewRoomButton;