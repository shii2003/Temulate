import React from 'react';

type ExitCodeRoomButtonProps = {

};

const ExitCodeRoomButton: React.FC<ExitCodeRoomButtonProps> = () => {

    return (
        <button className='flex items-center justify-center px-4 py-2  rounded-md text-neutral-500 hover:text-neutral-400  border font-medium border-neutral-700 bg-neutral-800 bg-opacity-40 hover:bg-opacity-85'>
            exit
        </button>
    )
}
export default ExitCodeRoomButton;