import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import UnauthenticatedRoute from '@/components/UnauthenticatedRoute';
import Link from 'next/link';
import React from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    return (
        <UnauthenticatedRoute>
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
                                    name="username"
                                    id="username"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="Jhon Doeeeee"
                                    required
                                />
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
                                    name="email"
                                    id="email"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                />
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
                                    name="password"
                                    id="password"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
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
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-neutral-300 font-medium focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25  rounded-lg text-sm px-5 py-2.5 text-center tracking-[.05rem]"
                            >
                                Create and account
                            </button>
                            {/* {error && <p className='text-red-500 text-sm mt-2'>{error}</p>} */}
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
        </UnauthenticatedRoute>
    )
}
export default page;