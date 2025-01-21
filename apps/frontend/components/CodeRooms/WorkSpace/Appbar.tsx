import ExitCodeRoomButton from '@/components/ui/buttons/ExitCodeRoomButton';
import { FaRegCopy } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import React from 'react';


const Appbar: React.FC = () => {

    return (
        <div className='flex bg-neutral-800 justify-between gap-5 px-4 py-2  border-b border-neutral-800 w-full max-w-7xl'>
            <div className='flex items-center justify-center text-neutral-400 font-medium rounded-full border-2 border-indigo-400 px-4 py-2 bg-indigo-400 bg-opacity-20 gap-2'>
                <div className='flex items-center justify-center overflow-y-hidden rounded-full h-5 w-5'>
                    <CgProfile className='text-neutral-300' />
                </div>
                <p className='flex justify-center items-center'>username</p>
            </div>
            <div className='flex justify-center  gap-4 items-center text-neutral-500 font-semibold'>
                <p>Room id:</p>
                <div className='p-2 border-2 flex gap-3 items-center justify-center text-indigo-200 border-neutral-700 rounded-md '>
                    <p>12345566785654</p>
                    <FaRegCopy className='text-neutral-500 hover:text-neutral-400' />
                </div>
            </div>
            <ExitCodeRoomButton />
        </div>
    )
}
export default Appbar;