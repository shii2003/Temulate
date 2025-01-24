import React from 'react';
import { BsFillSendFill } from "react-icons/bs";

type MessageInputBoxProps = {

};

const MessageInputBox: React.FC<MessageInputBoxProps> = () => {

    return (
        <div className='flex h-16 mb-10 gap-3 items-center justify-center px-3 py-2 '>
            <div className=' flex flex-grow items-center justify-center '>
                <textarea
                    className='w-full h-12 px-4 py-2 text-sm rounded-md bg-neutral-800 border-2 border-neutral-700 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-neutral-400'
                    placeholder='Type your message....'
                />
            </div>
            <div className=' h-10 w-10 flex items-center justify-center rounded-full p-2 cursor-pointer bg-neutral-700 hover:bg-neutral-600 '>
                <BsFillSendFill className='text-indigo-300 text-lg ' />
            </div>
        </div>
    )
}
export default MessageInputBox;