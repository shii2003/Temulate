import React from 'react';
import { MdOutlineAdd } from 'react-icons/md';

type CreateNewRoomButtonProps = {
    onClick: () => void;
};

const CreateNewRoomButton: React.FC<CreateNewRoomButtonProps> = ({ onClick }) => {

    return (
        <button
            className='flex items-center  justify-center gap-2 px-2 py-2 border border-neutral-700 rounded-md bg-neutral-700 hover:bg-opacity-30'
            onClick={onClick}
        >
            Add new room
            <MdOutlineAdd
                style={{ fontSize: '27px' }}
                className='text-indigo-300'
            />
        </button>
    )
}
export default CreateNewRoomButton;