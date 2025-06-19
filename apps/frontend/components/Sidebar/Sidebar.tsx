import Link from 'next/link';
import React from 'react';

import { BsPersonWorkspace } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import ResponsiveLogo from '../logo/ResponsiveLogo';
import MobileLogo from '../logo/MobileLogo';
import LogoutButton from '../ui/buttons/LogoutButton';
import UserInformation from './UserInformation';
import { MdColorLens } from "react-icons/md";
import { usePathname } from 'next/navigation';

type SidebarProps = {

};

const Sidebar: React.FC<SidebarProps> = () => {

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className=" borderh-screen w-16 sm:w-56 md:w-64 lg:w-80 bg-neutral-900 border-r border-neutral-800 overflow-hidden">

            <div className="flex flex-col items-center h-full text-neutral-500 font-semibold">

                <div className="h-16 flex items-center">
                    <div className="block sm:hidden">
                        <MobileLogo />
                    </div>
                    <div className="hidden sm:block p-4 mt-5">
                        <ResponsiveLogo />
                    </div>
                </div>

                <div className='mt-16 hidden sm:block'>
                    <UserInformation />
                </div>

                <div className="flex-1 mt-10">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="/menu"
                                className={`px-4 py-2 block  rounded-md hover:text-neutral-300 transition-transform transform hover:translate-x-2 ${isActive("/menu") ? 'text-neutral-300' : ""}`}
                            >
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <AiFillHome />
                                    <p className="hidden sm:block">
                                        Home
                                    </p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/canvas"
                                className={`px-4 py-2 rounded-md  block  hover:text-neutral-300 transition-transform transform hover:translate-x-2 ${isActive('/canvas') ? "text-neutral-300" : ""}`}
                            >
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <MdColorLens />
                                    <p className="hidden sm:block">
                                        Canvas
                                    </p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/myaccount"
                                className={`px-4 py-2 block  rounded-md hover:text-neutral-300 transition-transform transform hover:translate-x-2 ${isActive('/myaccount') ? "text-neutral-300" : ""}`}
                            >
                                <div className='flex gap-2 justify-center  sm:justify-start items-center'>
                                    <FaUser />
                                    <p className="hidden sm:block">
                                        My account
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