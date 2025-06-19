"use client";
import { RootState } from '@/store/store';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CiUser } from "react-icons/ci";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { toast } from 'sonner';
import { FaRegCheckCircle } from 'react-icons/fa';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    const [copiedField, setCopiedField] = useState<string | number | null>(null);
    const userId = user?.id || "NA";
    const userName = user?.username || "NA";
    const email = user?.email || "NA";


    const userIdRef = useRef<HTMLParagraphElement>(null);
    const userNameRef = useRef<HTMLParagraphElement>(null);
    const emailRef = useRef<HTMLParagraphElement>(null);

    const copyToClipboard = (ref: React.RefObject<HTMLParagraphElement | null>, field: string | number) => {
        if (!ref || !ref.current) {
            toast.error("failed to copy. Try again!")
            return;
        }
        navigator.clipboard.writeText(ref.current.innerText);
        toast.success("Copied to Clipboard!")
        setCopiedField(field);

        setTimeout(() => {
            setCopiedField(null);
        }, 2000)
    }
    return (
        <div className='flex flex-col items-start justify-start h-full'>
            <div className='flex w-full text-xl sm:text-2xl md:text-4xl  px-4 py-2 text-neutral-400'>
                My Account
            </div>
            <div className='flex-1 w-full  mt-4 sm:mt-7 md:mt-9 pl-4 sm:pl-6 md:pl-10 pr-2 '>

                <div className="relative w-full md:max-w-[750px]  border border-neutral-800 rounded-md overflow-hidden">

                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundColor: '#262626',
                            WebkitMaskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                            maskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                            WebkitMaskSize: 'cover',
                            maskSize: 'cover',
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4 text-white bg-transparent">
                        <div className='flex items-center justify-center w-full px-2 py-3 border-b border-neutral-700'>
                            <div className='flex items-center justify-center h-20 w-20 rounded-full overflow-hidden p-2 border border-neutral-700 bg-neutral-700/30'>
                                <CiUser className="w-20 h-20 text-neutral-400" />
                            </div>
                        </div>

                        <div className='flex flex-col items-start justify-center w-full px-4 py-2 border-b border-neutral-700'>
                            <p className='text-sm text-neutral-300 tracking-wide'>UserId</p>
                            <div className='flex justify-between items-center  w-full'>
                                <p
                                    ref={userIdRef}
                                    className='text-lg '
                                >{userId}</p>
                                <button
                                    onClick={() => copyToClipboard(userIdRef, "userId")}
                                    className='h-full p-1'>
                                    {copiedField === "userId" ? (
                                        <FaRegCheckCircle className='text-green-400' />
                                    ) : (
                                        <FaRegCopy className='hover:text-indigo-400 text-neutral-400' />
                                    )}
                                </button>
                            </div>

                        </div>
                        <div className='flex flex-col items-start justify-center w-full px-4 py-2 border-b border-neutral-700'>
                            <p className='text-sm text-neutral-300 tracking-wide'>Username</p>
                            <div className='flex justify-between items-center w-full'>
                                <p
                                    ref={userNameRef}
                                    className='text-lg'
                                >{userName}</p>
                                <button
                                    onClick={() => copyToClipboard(userNameRef, "userName")}
                                    className='h-full p-1'
                                >
                                    {copiedField === "userName" ?
                                        (<FaRegCheckCircle className='text-green-400' />

                                        ) : (
                                            <FaRegCopy className='hover:text-indigo-400 text-neutral-400' />
                                        )}
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col items-start justify-center w-full px-4 py-2'>
                            <p className='text-sm text-neutral-300 tracking-wide'>Email</p>
                            <div className='flex justify-between items-center w-full'>
                                <p
                                    ref={emailRef}
                                    className='text-lg'
                                >{email}</p>
                                <button
                                    onClick={() => copyToClipboard(emailRef, "email")}
                                    className='h-full p-1'
                                >
                                    {copiedField === "email" ?
                                        (<FaRegCheckCircle className='text-green-400' />

                                        ) : (
                                            <FaRegCopy className='hover:text-indigo-400 text-neutral-400' />
                                        )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default page;