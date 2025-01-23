import React from 'react';
import { BsFillSendFill } from "react-icons/bs";

type MessageInputBoxProps = {

};

const MessageInputBox: React.FC<MessageInputBoxProps> = () => {

    return (
        <div className='flex gap-3'>
            <div>

            </div>
            <div>

            </div>
            <div className=' h-4 w-4 rounded-full p-2'>
                <BsFillSendFill className='text-indigo-300' />
            </div>
        </div>
    )
}
export default MessageInputBox;