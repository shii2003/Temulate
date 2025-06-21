import React from 'react';
import { MdColorLens } from 'react-icons/md';
import { FaPen } from "react-icons/fa";
import { LuEraser } from 'react-icons/lu';
import { RiResetLeftFill } from 'react-icons/ri';
import { FiDownload } from 'react-icons/fi';

type CanvasTopBarProps = {
    selectedColor: string
    toggleColorPicker: () => void;
    colorPickerButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const CanvasTopBar: React.FC<CanvasTopBarProps> = ({ selectedColor, toggleColorPicker, colorPickerButtonRef }) => {
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
                <button
                    ref={colorPickerButtonRef}
                    className='flex gap-4 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'
                    onClick={toggleColorPicker}
                >
                    <MdColorLens className='hidden md:block' />
                    <p className='h-5 w-5 rounded-md bg-slate-400' style={{ backgroundColor: selectedColor }}></p>
                </button>
                <button className='flex gap-2 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <FaPen />
                    <p className='text-sm hidden md:block'>Brush</p>
                </button>
                <button className='flex gap-2 items-center justify-center rounded-md border px-3 py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <LuEraser />
                    <p className='text-sm hidden md:block'>Eraser</p>
                </button>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-3">
                <button className='flex items-center justify-center gap-2 border px-3 py-2 rounded-md text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'>
                    <RiResetLeftFill />
                    <p className='text-sm hidden md:block'>Reset</p>
                </button>
                <button className='flex border px-3 py-2 rounded-md items-center justify-center gap-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20 '>
                    <FiDownload />
                    <p className='text-sm hidden md:block'>Export</p>
                </button>
            </div>
        </div>
    );
};

export default CanvasTopBar;
