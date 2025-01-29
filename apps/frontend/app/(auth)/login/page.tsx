"use client";
import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/store/features/auth/authSlice';
import { loginSchema } from '@/types/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


type pageProps = {

};

type LoginFormData = z.infer<typeof loginSchema>;

const page: React.FC<pageProps> = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const handleLogin = async (data: LoginFormData) => {

        const loadingToastId = toast.loading('Logging in...');
        try {
            const result = await dispatch(login(data));
            console.log("login result:", result);

            if (login.fulfilled.match(result)) {
                toast.success('Logged in successfully.', {
                    id: loadingToastId,
                });
                router.push('/menu');
            } else if (login.rejected.match(result)) {
                toast.error(result.payload as string, {
                    id: loadingToastId,
                });
            }
        } catch (error) {
            toast.error('An unexpected error occured druring login.', {
                id: loadingToastId,
            });
        }
    };

    return (
        <div className='h-full flex  items-center justify-center'>
            <div className=" sm:w-full bg-neutral-900 bg-opacity-70  rounded-lg shadow border-2 border-neutral-800 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-center'>
                        <ResponsiveLogo />
                    </div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-400 md:text-2xl">
                        Login
                    </h1>
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit(handleLogin)}
                    >

                        <div className='mb-6 flex  flex-col gap-4'>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-neutral-300"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className=''>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-neutral-300"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        {error && <p className='text-sm text-red-500'>{error}</p>}
                        <button
                            type="submit"
                            className={`w-full text-sm font-medium text-neutral-300 focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25  rounded-lg text-md px-5 py-2.5 text-center tracking-[.05rem] `}

                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>


                        <p className="text-sm font-light text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default page;