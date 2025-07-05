import React from 'react';
import { Courgette } from 'next/font/google';

const courgette = Courgette({
    weight: '400',
    subsets: ['latin'],
});

const LoadingSkeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-neutral-700/50 rounded ${className}`} />
);

const loading: React.FC = () => {
    return (
        <div className='flex flex-1 w-full flex-col h-full overflow-hidden bg-neutral-900'>
            <div className='flex flex-col items-center px-4 py-2 gap-3 mt-9 h-full min-h-0'>
                <div className='flex w-full items-center justify-start'>

                </div>
                <div className='flex-1 h-full items-center w-full flex flex-col min-h-0'>

                    <div className="flex items-center justify-center flex-col w-full px-2 py-4 text-center gap-2">
                        <div className={`text-xl md:text-3xl lg:text-5xl ${courgette.className} tracking-tighter`}>
                            <span className='text-neutral-300'>Start your own{' '}</span>
                            <span className={`font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent tracking-wide ${courgette.className}`}>
                                CANVAS
                            </span>{' '}
                            <span className='text-neutral-300'>- Alone or With Friends!</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <LoadingSkeleton className="h-6 md:h-8 w-64 md:w-80" />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-center mt-1 sm:mt-3 md:mt-4'>
                        <LoadingSkeleton className="h-32 w-full max-w-md rounded-lg" />
                    </div>

                    <div className='mt-2 sm:mt-4 md:mt-7 flex-1 w-full items-center flex flex-col min-h-0 overflow-auto'>
                        <div className='flex justify-center items-start h-full px-4 py-2 gap-3 sm:gap-4 md:gap-10 flex-wrap w-full min-h-0 overflow-auto'>

                            <div className="flex flex-col items-start p-6 rounded-lg  w-56 h-40  bg-neutral-800/30 border border-neutral-700/20 backdrop-blur-sm min-w-[280px] max-w-[320px] ">
                                <LoadingSkeleton className="h-12 rounded-md mb-4 w-full" />
                                <LoadingSkeleton className="h-10 w-full rounded-md" />
                            </div>

                            <div className="flex flex-col w-56 h-40 items-center p-6 rounded-lg border border-neutral-700/20 bg-neutral-800/30 backdrop-blur-sm min-w-[280px] max-w-[320px] ">
                                <LoadingSkeleton className="h-12 rounded-md mb-4 w-full" />
                                <LoadingSkeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default loading;