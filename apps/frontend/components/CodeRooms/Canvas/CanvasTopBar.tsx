import React from 'react';
import { MdColorLens } from 'react-icons/md';
import { FaPen } from "react-icons/fa";
import { LuEraser } from 'react-icons/lu';
import { RiResetLeftFill } from 'react-icons/ri';
import { FiDownload } from 'react-icons/fi';

type CanvasTopBarProps = {};

const CanvasTopBar: React.FC<CanvasTopBarProps> = () => {
    return (
        <div className="relative h-16 w-full border-b border-neutral-800 px-3 py-1 flex items-center justify-between overflow-hidden">

            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/cartographer.png')",
                    backgroundSize: '300px 300px',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    WebkitMaskImage:
                        'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                    maskImage:
                        'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                    WebkitMaskSize: 'cover',
                    maskSize: 'cover',
                }}
            />

            <div className="relative z-10 flex gap-3">
                <div className='flex gap-2 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <MdColorLens />
                    <p className='text-sm hidden md:block'>Color</p>
                </div>
                <div className='flex gap-2 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <FaPen />
                    <p className='text-sm hidden md:block'>Brush</p>
                </div>
                <div className='flex gap-2 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <LuEraser />
                    <p className='text-sm hidden md:block'>Eraser</p>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-3">
                <div className='flex items-center justify-center gap-2 border px-3 py-2 rounded-md text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <RiResetLeftFill />
                    <p className='text-sm hidden md:block'>Reset</p>
                </div>
                <div className='flex border px-3 py-2 rounded-md items-center justify-center gap-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <FiDownload />
                    <p className='text-sm hidden md:block'>Export</p>
                </div>
            </div>
        </div>
    );
};

export default CanvasTopBar;
