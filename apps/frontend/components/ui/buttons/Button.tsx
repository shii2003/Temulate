"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

type ButtonProps = {
    title: string;
    onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {

    const router = useRouter();
    const handleNavigation = () => {
        if (onClick) {
            onClick();
        }


        if (title === "Login") {
            router.push("/login");
        } else if (title === "SignUp") {
            router.push("/signup");
        }
    }

    return (
        <button
            className='
        relative flex items-center justify-center px-5 py-2.5 
        rounded-lg text-sm font-medium 
        text-neutral-300 hover:text-neutral-200
        border border-white/10 
        bg-neutral-800/40 backdrop-blur-xl
        shadow-[0_0_12px_rgba(255,255,255,0.04),inset_0_0_8px_rgba(255,255,255,0.05)]
        transition duration-200
        hover:shadow-[0_0_18px_rgba(255,255,255,0.07),inset_0_0_12px_rgba(255,255,255,0.08)]
        hover:bg-neutral-800/60'
            onClick={handleNavigation}
        >
            {title}
        </button>
    )
}
export default Button;