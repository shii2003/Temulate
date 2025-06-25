'use client';
import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';

type UserInformationProps = {

};

const UserInformation: React.FC<UserInformationProps> = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);

    return (
        <div
            className='flex items-center justify-center flex-col px-6 py-2 gap-2 border border-neutral-700 rounded-full text-neutral-200 font-normal tracking-wide bg-neutral-700/30 h-10 min-w-[8rem]'
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
                <div className='h-4 w-24 bg-neutral-600 rounded-md animate-pulse'></div>
            ) : (
                <p className="truncate">{user?.username}</p>
            )}
        </div>
    )
}
export default UserInformation;