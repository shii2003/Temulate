import React from 'react';

import { MdDelete } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

type DeleteCodeRoomProps = {

};

const DeleteCodeRoom: React.FC<DeleteCodeRoomProps> = () => {

    return (
        <button
            className='flex items-center gap-2 justify-center px-2 py-1 font- rounded-md text-white bg-opacity-75 hover:bg-opacity-60 font-semibold  '


        >
            <MdDelete size={20} />
        </button>
    )
}
export default DeleteCodeRoom;