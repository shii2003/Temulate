import React from 'react';
import { MdColorLens, MdTune } from 'react-icons/md';
import { FaPen } from "react-icons/fa";
import { LuEraser, LuSave } from 'react-icons/lu';
import { RiResetLeftFill } from 'react-icons/ri';
import { FiDownload } from 'react-icons/fi';
import { LiaSaveSolid } from 'react-icons/lia';

type CanvasTopBarProps = {

    selectedColor: string;
    colorPickerButtonRef: React.RefObject<HTMLButtonElement | null>;
    toggleColorPicker: () => void;
    brushSize: number;
    brushSizeButtonRef: React.RefObject<HTMLButtonElement | null>;
    toggleSizeSelector: () => void;
    eraserSize: number;
    isEraserMode: boolean;
    eraserToggleButtonRef: React.RefObject<HTMLButtonElement | null>;
    eraserSizeButtonRef: React.RefObject<HTMLButtonElement | null>;
    toggleEraserMode: () => void;
    toggleEraserSizeSelector: () => void;
    setIsResetOptionOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsExportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CanvasTopBar: React.FC<CanvasTopBarProps> = ({
    selectedColor,
    colorPickerButtonRef,
    toggleColorPicker,
    brushSize,
    brushSizeButtonRef,
    toggleSizeSelector,
    eraserSize,
    isEraserMode,
    eraserToggleButtonRef,
    eraserSizeButtonRef,
    toggleEraserMode,
    toggleEraserSizeSelector,
    setIsResetOptionOpen,
    setIsSaveModalOpen,
    setIsExportModalOpen,
}) => {
    return (
        <div className="relative h-16 w-full border-b border-neutral-800 px-3 py-1 flex items-center justify-between overflow-hidden gap-1">

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

            <div className="relative z-10 flex gap-1 sm:gap-2 md:gap-3">
                <button
                    ref={colorPickerButtonRef}
                    className='flex gap-4 items-center justify-center rounded-md border p-2 md:px-3 md:py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'
                    onClick={toggleColorPicker}
                >
                    <MdColorLens className='hidden md:block' />
                    <p className='h-5 w-5 rounded-md bg-slate-400' style={{ backgroundColor: selectedColor }}></p>
                </button>
                <button
                    ref={brushSizeButtonRef}
                    className='flex gap-2 items-center justify-center rounded-md border p-2 md:px-3 md:py-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'
                    onClick={toggleSizeSelector}
                >
                    <FaPen className='hidden md:block' />
                    {/* <p className='text-sm hidden md:block'>Brush</p> */}
                    <div className='w-8 flex h-full text-xs sm:text-sm rounded-md border-neutral-700 border items-center justify-center p-1 '>
                        {brushSize}
                    </div>
                </button>
                <button
                    ref={eraserToggleButtonRef}
                    className={`flex gap-1 md:gap-2 items-center justify-center rounded-md border p-2 md:px-3 md:py-2   ${isEraserMode ? "border-rose-600 bg-rose-500/20 hover:bg-rose-500/40 text-white" : " border-neutral-600 hover:bg-neutral-700/60  bg-neutral-700/20 text-neutral-300 "}`}
                    onClick={toggleEraserMode}
                >
                    <LuEraser size={16} />
                    {/* <p className='text-sm hidden md:block'>Eraser</p> */}
                    <div className={`w-8 flex h-full rounded-md  border text-xs sm:text-sm p-1 items-center justify-center ${isEraserMode ? "  border-rose-600/60" : "border-neutral-700"} `}>
                        {isEraserMode ? 'On ' : 'Off'}
                    </div>
                </button>
                {isEraserMode && (
                    <button
                        ref={eraserSizeButtonRef}
                        className={`flex gap-2 text-xs sm:text-sm items-center justify-center rounded-md border p-2 md:px-3 md:py-2  bg-indigo-500/40 border-indigo-400 hover:bg-indigo-500/60 text-white  `}
                        onClick={toggleEraserSizeSelector}
                    >
                        <MdTune size={24} className='hidden lg:block' />
                        {/* <p className='text-sm hidden md:block'>Eraser</p> */}
                        <div className="w-8 flex h-full rounded-md  border items-center justify-center border-indigo-400/80 p-1">
                            {eraserSize}
                        </div>
                    </button>
                )}
            </div>



            <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                <button
                    className={`flex items-center justify-center gap-2 border px-3 py-2 rounded-md text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20`}
                    onClick={() => setIsResetOptionOpen(true)}
                >
                    <RiResetLeftFill />
                    <p className='text-sm hidden lg:block'>Reset</p>
                </button>
                <button
                    className={`flex items-center justify-center gap-2 border px-3 py-2 rounded-md text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20`}
                    onClick={() => setIsSaveModalOpen(true)}
                >
                    <LiaSaveSolid />
                    <p className='text-sm hidden lg:block'>Save</p>
                </button>
                <button
                    className='flex border px-3 py-2 rounded-md items-center justify-center gap-2 text-neutral-300 border-neutral-600 hover:bg-neutral-700/60 bg-neutral-700/20'
                    onClick={() => setIsExportModalOpen(true)}
                >
                    <FiDownload />
                    <p className='text-sm hidden lg:block'>Export</p>
                </button>
            </div>
        </div>
    );
};

export default CanvasTopBar;
