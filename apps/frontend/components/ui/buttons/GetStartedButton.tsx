"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

type GetStartedButtonProps = {

};

const GetStartedButton: React.FC<GetStartedButtonProps> = ({ }) => {

    const router = useRouter();

    const handleClick = () => {
        router.push('/login');
    };

    return (
        <button
            onClick={handleClick}
            className='px-4 py-2 text-white rounded-md border border-indigo-300 bg-indigo-300  bg-opacity-15 font-medium hover:bg-opacity-20 '>
            Get Started For Free
        </button>
    )
}
export default GetStartedButton;