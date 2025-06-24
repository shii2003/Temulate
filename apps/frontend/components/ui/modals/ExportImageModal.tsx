import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';

type ExportImageModalProps = {
    setIsExportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    backgroundColorHexCode: string;
};

const ExportImageModal: React.FC<ExportImageModalProps> = ({ setIsExportModalOpen, canvasRef, backgroundColorHexCode }) => {

    const handleDownload = (format: 'png' | 'jpg' | 'jpeg') => {
        const canvas = canvasRef.current;
        if (!canvas) {
            toast.error("An error occured!");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = backgroundColorHexCode;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const link = document.createElement('a');
        link.download = `canvas-image.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();

        const imageType = format.toUpperCase();
        toast.success(`${imageType} image successfully downloaded.`)
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
            <div className='flex flex-col gap-3 bg-neutral-800  w-96 text-neutral-300 rounded-md px-4 py-2 '>
                <div className='flex items-center justify-end '>
                    <IoClose
                        onClick={() => setIsExportModalOpen(false)}
                        size={24}
                        className='text-red-500  hover:text-red-400'
                    />
                </div>
                <div className='flex flex-col mb-3 px-2 gap-2'>
                    <p className='text-lg font-semibold '>Download the PNG  of the cavas. </p>
                    <p className='text-sm mb-4'>this will download a PNG, JPG or JPEG version to your device</p>
                    <div className='flex flex-col gap-3 justify-between px-2'>
                        <button
                            className='flex gap-2 items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50'
                            onClick={() => handleDownload('png')}
                        >
                            <FiDownload size={24} />
                            Download as PNG
                        </button>
                        <button
                            className='flex gap-2 items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50'
                            onClick={() => handleDownload('jpg')}
                        >
                            <FiDownload size={24} />
                            Download as JPG
                        </button>
                        <button
                            className='flex gap-2 items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50'
                            onClick={() => handleDownload('jpeg')}
                        >
                            <FiDownload size={24} />
                            Download JPEG
                        </button>
                        <button
                            className='flex w-full items-center justify-center px-3 py-2 rounded-md  font-semibold border-red-400/45 border hover:bg-red-400/20 text-white hover:border-red-500/20 bg-red-400/30'
                            onClick={() => setIsExportModalOpen(false)}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExportImageModal;