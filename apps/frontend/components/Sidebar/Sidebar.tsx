import Link from 'next/link';
import React from 'react';

import { BsPersonWorkspace } from "react-icons/bs";
import { IoChatbubble } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import ResponsiveLogo from '../logo/ResponsiveLogo';
import MobileLogo from '../logo/MobileLogo';
import LogoutButton from '../ui/buttons/LogoutButton';
import UserInformation from './UserInformation';



type SidebarProps = {

};

const Sidebar: React.FC<SidebarProps> = () => {



    return (
        <div className="h-screen w-16 sm:w-56 md:w-64 lg:w-80 bg-neutral-900 border-r border-neutral-800">

            <div className="flex flex-col items-center h-full text-neutral-500 font-semibold">

                <div className="h-16 flex items-center">
                    <div className="block sm:hidden">
                        <MobileLogo />
                    </div>
                    <div className="hidden sm:block p-4">
                        <ResponsiveLogo />
                    </div>
                </div>

                <div className='mt-16 hidden sm:block'>
                    <UserInformation />
                </div>

                <div className="flex-1 mt-10">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/menu" className=" px-4 py-2 block  rounded-md hover:text-neutral-300 transition-transform transform hover:translate-x-2">
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <AiFillHome />
                                    <p className="hidden sm:block">
                                        Home
                                    </p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className=" px-4 py-2 rounded-md  block  hover:text-neutral-300 transition-transform transform hover:translate-x-2">
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <BsPersonWorkspace />
                                    <p className="hidden sm:block">
                                        Code Rooms
                                    </p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className=" px-4 py-2 block  rounded-md hover:text-neutral-300 transition-transform transform hover:translate-x-2">
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <HiUserGroup />
                                    <p className="hidden sm:block">
                                        Friends
                                    </p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className=" px-4 py-2 block  rounded-md hover:text-neutral-300 transition-transform transform hover:translate-x-2">
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <IoChatbubble />
                                    <p className="hidden sm:block">
                                        Chat
                                    </p>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>


                <div className="mb-8">
                    <LogoutButton />
                </div>
            </div>
        </div>
    )

}
export default Sidebar;