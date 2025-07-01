"use client"
import { useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/features/auth/authSlice';
import { persistor, RESET_ALL } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiLogOut } from "react-icons/fi";
import { toast } from 'sonner';

const LogoutButton: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {

        const loadingToastId = toast.loading('Logging out...');

        try {
            const resultAction = await dispatch(logout());
            console.log("logout result:", resultAction);

            if (logout.fulfilled.match(resultAction)) {
                toast.success('Logged out successfully.', {
                    id: loadingToastId
                });
                dispatch({ type: RESET_ALL });
                await persistor.purge();
                router.push("/");
            } else if (logout.rejected.match(resultAction)) {
                toast.error(resultAction.payload as string, {
                    id: loadingToastId,
                })
            }
        } catch (error) {
            toast.error('An unexpected error occured during logout.', {
                id: loadingToastId,
            });
        }
    };

    return (

        <button
            onClick={handleLogout}
            className='flex gap-3 border items-center justify-center border-indigo-300 bg-indigo-300 rounded-md bg-opacity-20 px-4 py-2 text-indigo-200 hover:bg-opacity-25 hover:text-indigo-100'
        >
            <FiLogOut />
            <p className='hidden sm:block'>Logout</p>
        </button>
    )
}
export default LogoutButton;