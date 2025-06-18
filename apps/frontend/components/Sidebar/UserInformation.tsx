'use client';
import { RootState } from '@/store/store';
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useSelector } from 'react-redux';

type UserInformationProps = {

};

const UserInformation: React.FC<UserInformationProps> = () => {

    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className=' flex-col px-6 py-2 gap-4 flex border border-neutral-700 rounded-full text-neutral-500 font-normal tracking-wide bg-neutral-700/30'>
            {user?.username}
        </div>
    )
}
export default UserInformation;