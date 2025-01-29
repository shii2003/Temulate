"use client"
import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { signup } from '@/store/features/auth/authSlice';
import { signupSchema } from '@/types/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type pageProps = {

};

type SignupFormData = z.infer<typeof signupSchema>;

const page: React.FC<pageProps> = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { isLoading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

    const handleSignup = async (data: SignupFormData) => {


        const loadingToastId = toast.loading('Creating account...');
        try {
            const result = await dispatch(signup(data));

            if (signup.fulfilled.match(result)) {
                toast.success("Account created successfully!", {
                    id: loadingToastId,
                });
                router.push('/menu');
            } else if (signup.rejected.match(result)) {
                toast.error(result.payload as string, {
                    id: loadingToastId,

                });
            }
        } catch (error) {
            toast.error("An unexpected error occured!",
                {
                    id: loadingToastId,
                });
        }
    };

    return (
        <div className='flex  items-center justify-center h-full '>
            <div className=" sm:w-full bg-neutral-900 bg-opacity-70  rounded-lg shadow border-2 border-neutral-800 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-center'>
                        <ResponsiveLogo />
                    </div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-400 md:text-2xl">
                        Create an account
                    </h1>
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit(handleSignup)}
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Your Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username")}
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="Jhon Doeeeee"
                                required
                            />
                            {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
                        </div>
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
                            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                        </div>
                        <div>
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
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Confirm password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register("confirmPassword")}
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="••••••••"
                                required
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full text-neutral-300 font-medium focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25  rounded-lg text-sm px-5 py-2.5 text-center tracking-[.05rem]"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                        <p className="text-sm font-light text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default page;