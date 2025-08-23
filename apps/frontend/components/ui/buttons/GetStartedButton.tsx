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
            className='relative flex items-center justify-center px-6 py-3 
        rounded-xl text-sm font-medium
        text-neutral-200 hover:text-neutral-100
        border border-indigo-200/30 
        bg-neutral-800/40 backdrop-blur-xl
        shadow-[0_0_18px_rgba(199,210,254,0.25),inset_0_0_12px_rgba(199,210,254,0.15)]
        transition duration-200
        hover:shadow-[0_0_28px_rgba(199,210,254,0.35),inset_0_0_18px_rgba(199,210,254,0.25)]
        hover:bg-neutral-800/60'>
            Get Started For Free
            <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_25px_rgba(199,210,254,0.2)]"></span>
        </button>
    );
}
export default GetStartedButton;