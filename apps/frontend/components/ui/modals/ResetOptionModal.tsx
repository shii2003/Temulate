import React from 'react';
import { IoClose } from 'react-icons/io5';

type ResetOptionModalProps = {
    setIsResetOptionOpen: React.Dispatch<React.SetStateAction<boolean>>;

};

const ResetOptionModal: React.FC<ResetOptionModalProps> = ({ setIsResetOptionOpen }) => {

    return (
        <div className='fixed inset-0 flex items-center justify-center rounded-md z-50 bg-black/50'>
            <div className='flex flex-col gap-3 bg-neutral-800  w-96 text-neutral-300 rounded-md px-4 py-2'>
                <div className='flex items-center justify-end '>
                    <IoClose
                        onClick={() => setIsResetOptionOpen(false)}
                        size={24}
                        className='text-red-500  hover:text-red-400'
                    />
                </div>
                <div className='flex flex-col mb-3 px-2 gap-2'>
                    <p className='text-lg font-semibold '>Are you sure you want to reset the canvas? </p>
                    <p className='text-sm mb-3'> This will permanently erase everything on the canvas. This action cannot be undone.</p>
                    <div className='flex justify-between px-2'>
                        <button
                            className='flex items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50 w-20 '
                        >
                            Yes
                        </button>
                        <button
                            className='flex items-center justify-center px-3 py-2 rounded-md w-20 font-semibold border-neutral-700 border hover:bg-red-400/20 hover:text-white hover:border-red-500/20 bg-neutral-700/80'
                            onClick={() => setIsResetOptionOpen(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ResetOptionModal;