"use client";
import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/store/features/auth/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();
        const loadingToastId = toast.loading('Loggin in...');
        try {
            const result = await dispatch(login({ email, password }));
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
                        onSubmit={handleLogin}
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
                                    value={email}
                                    name="email"
                                    id="email"
                                    onChange={((e) => setEmail(e.target.value))}
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required

                                />
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
                                    value={password}
                                    name="password"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            className={`w-full text-sm font-medium text-neutral-300 focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25  rounded-lg text-md px-5 py-2.5 text-center tracking-[.05rem] `}

                        >
                            {isLoading ? 'Loggin in...' : 'Login'}
                        </button>
                        {error && <p className='text-sm text-red-500'>{error}</p>}

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