'use client';
import { RootState } from '@/store/store';
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useSelector } from 'react-redux';

type UserInformationProps = {

};

const UserInformation: React.FC<UserInformationProps> = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);

    return (
        <div
            className='flex items-center  justify-center flex-col px-6 h-10  py-2 gap-2  border border-neutral-700 rounded-full text-neutral-200 font-normal tracking-wide bg-neutral-700/30'
            style={{
                WebkitMaskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                maskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
            }}
        >
            {isLoading ? (
                <div className='w-24 h-20 rounded-md animate-pulse bg-neutral-600 w-10ch'></div>
            ) : (
                user?.username
            )}
        </div>
    )
}
export default UserInformation;