"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoEnter } from "react-icons/io5";

type EnterRoom = {

};

const EnterRoom: React.FC<EnterRoom> = () => {

    return (
        <button
            className='flex items-center gap-2 justify-center px-2 py-1 font- rounded-md text-white bg-opacity-75 hover:bg-opacity-60 font-semibold bg-indigo-400 '


        >
            Enter
            <IoEnter />
        </button>
    )
}
export default EnterRoom;