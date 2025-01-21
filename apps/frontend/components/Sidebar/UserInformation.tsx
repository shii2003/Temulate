import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";

type UserInformationProps = {

};

const UserInformation: React.FC<UserInformationProps> = () => {

    return (
        <div className=' px-4 py-2 gap-4 flex border-2 border-neutral-800 rounded-md text-neutral-500'>
            <div className='rounded-full h-12 w-12 border border-neutral-800 overflow-hidden flex justify-center items-center'>
                <CgProfile className='h-11 w-11 text-neutral-700' />
            </div>
            <div className='gap-5'>
                <div className='flex gap-2 justify-between'>
                    Username

                </div>
                <div className='flex gap-2 justify-between  hover:underline'>
                    email

                </div>
            </div>
        </div>
    )
}
export default UserInformation;