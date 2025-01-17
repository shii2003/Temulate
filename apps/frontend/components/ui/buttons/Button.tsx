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
            className='flex items-center justify-center px-4 py-2  rounded-md text-neutral-500 hover:text-neutral-400  border font-medium border-neutral-700 bg-neutral-800 bg-opacity-40 hover:bg-opacity-85'
            onClick={handleNavigation}
        >
            {title}
        </button>
    )
}
export default Button;