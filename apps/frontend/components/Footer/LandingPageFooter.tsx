import React from 'react';
import Logo from '../Navbar/Logo';
import { GrGithub } from 'react-icons/gr';

type LandingPageFooterProps = {

};

const LandingPageFooter: React.FC<LandingPageFooterProps> = () => {

    return (
        <div className='flex  border-t border-neutral-700 w-full justify-center items-start'>
            <div className='flex  max-w-5xl w-full items-start justify-between mt-2 px-6 py-2 '>
                <div className='flex flex-col flex-wrap  gap-3 items-start  '>
                    <div className='flex items-center justify-center gap-3 '>
                        <div className='block md:hidden'>
                            <Logo size={40} />
                        </div>
                        <div className="hidden md:block">
                            <Logo size={60} />
                        </div>
                        <p className='text-lg sm:text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-700 bg-clip-text text-transparent'>Temulate</p>
                    </div>
                    <div className='flex text-sm sm:text-md flex-col px-2  text-md font-medium  text-neutral-300'>
                        <p>Temulate is a webstie where  </p>
                        <p>people can share and collaborate</p>
                        <p>in a realtime canvas.</p>
                    </div>
                    <div className='px-3 py-1 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700/70'>
                        <GrGithub size={20} />
                    </div>
                    <div className='flex'>
                        <p className='text-sm sm:text-md font-medium text-neutral-500 '>© 2025 Temulate. All rights reserved.</p>
                    </div>
                </div>
                <div className='flex flex-col  gap-3 items-start'>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <div className='flex flex-col'>
                            <div className='text-md font-bold text-indigo-200'>Quick Links</div>
                            <div className='text-sm sm:text-md flex flex-col px-2 items-start'>
                                <button className='text-neutral-300 hover:text-indigo-400'>About Us</button>
                                <button className='text-neutral-300 hover:text-indigo-400'>Privacy Policy</button>
                                <button className='text-neutral-300 hover:text-indigo-400'>Contact</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default LandingPageFooter;