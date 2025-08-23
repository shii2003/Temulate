"use client";
import React, { useEffect, useState } from 'react';
import ResponsiveLogo from '../logo/ResponsiveLogo';
import { GrGithub } from "react-icons/gr";
import Button from '../ui/buttons/Button';
import Logo from './Logo';


const Navbar: React.FC = () => {

    return (<div className='fixed top-4 left-1/2 -translate-x-1/2 
                 bg-neutral-900/80 backdrop-blur-md shadow-lg
                 px-6 py-2 rounded-full flex items-center justify-between gap-6 z-50 border border-neutral-700'>
        <div className='flex items-center justify-between gap-3'>
            <Logo size={50} />
            <p className='text-2xl font-bold tracking-wide bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-700 bg-clip-text text-transparent'>Temulate</p>
        </div>
        <div className='flex items-center justify-center gap-3'>

            <div>About</div>
            <div> Features</div>
            <div className='px-3 py-1 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700/70'> <GrGithub size={20} /></div>
        </div>
        <div className='flex items-center gap-4'>
            <Button title={"Login"} />
            <Button title={"SignUp"} />
        </div>
    </div>)
}
export default Navbar;