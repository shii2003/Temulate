"use client"
// import { useAppDispatch } from '@/store/hooks/hooks';
// import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiLogOut } from "react-icons/fi";

const LogoutButton: React.FC = () => {

    // const dispatch = useAppDispatch();
    // const router = useRouter();

    // const handleLogout = () => {
    //     dispatch(logout());
    //     console.log("logged out succefully")
    //     router.push("/")
    // }

    return (

        <button
            className='flex gap-3 border items-center justify-center border-indigo-300 bg-indigo-300 rounded-md bg-opacity-20 px-4 py-2 text-indigo-200 hover:bg-opacity-25 hover:text-indigo-100'
        // onClick={handleLogout}
        >
            <FiLogOut />
            <p className='hidden sm:block'>Logout</p>
        </button>
    )
}
export default LogoutButton;