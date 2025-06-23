import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

type ExportImageModalProps = {
    setIsExportModalOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const ExportImageModal: React.FC<ExportImageModalProps> = ({ setIsExportModalOpen }) => {

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
                    <p className='text-sm mb-4'>this will download a png version to your device</p>
                    <div className='flex justify-between px-2'>
                        <button
                            className='flex gap-2 items-center justify-center px-3 bg-indigo-400/80 py-2 rounded-md font-semibold text-white hover:bg-indigo-400/50'
                        >
                            <FiDownload size={24} />
                            Download
                        </button>
                        <button
                            className='flex items-center justify-center px-3 py-2 rounded-md w-20 font-semibold border-neutral-700 border hover:bg-red-400/20 hover:text-white hover:border-red-500/20 bg-neutral-700/80'
                            onClick={() => setIsExportModalOpen(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExportImageModal;