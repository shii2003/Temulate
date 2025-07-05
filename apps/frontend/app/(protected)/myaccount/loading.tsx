"use client";

import React from 'react';

const Loading = () => {
    return (
        <div className='flex flex-col items-start justify-start h-full bg-neutral-900'>

            <div className='flex  text-xl sm:text-2xl md:text-4xl px-4 py-2 h-14 w-48 text-neutral-600 rounded-md  '>
                <div className='h-full w-full bg-neutral-800 rounded-md animate-pulse' />
            </div>

            <div className='flex-1 w-full mt-4 sm:mt-7 md:mt-9 pl-4 sm:pl-6 md:pl-10 pr-2 animate-pulse'>
                <div className='relative w-full md:max-w-[750px] border border-neutral-800 rounded-md overflow-hidden'>

                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundColor: '#262626',
                            WebkitMaskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                            maskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                            WebkitMaskSize: 'cover',
                            maskSize: 'cover',
                        }}
                    />

                    <div className='relative z-10 flex flex-col items-center justify-center px-4 py-4 text-white bg-transparent'>

                        <div className='flex items-center justify-center w-full px-2 py-3 border-b border-neutral-700'>
                            <div className='h-20 w-20 rounded-full bg-neutral-700/50 border border-neutral-700' />
                        </div>

                        <div className='flex flex-col items-start justify-center w-full px-4 py-2 border-b border-neutral-700 gap-2'>
                            <div className='h-4 w-24 bg-neutral-700 rounded' />
                            <div className='flex justify-between items-center w-full'>
                                <div className='h-5 w-32 bg-neutral-800 rounded' />
                                <div className='h-5 w-5 bg-neutral-700 rounded' />
                            </div>
                        </div>

                        <div className='flex flex-col items-start justify-center w-full px-4 py-2 border-b border-neutral-700 gap-2'>
                            <div className='h-4 w-24 bg-neutral-700 rounded' />
                            <div className='flex justify-between items-center w-full'>
                                <div className='h-5 w-32 bg-neutral-800 rounded' />
                                <div className='h-5 w-5 bg-neutral-700 rounded' />
                            </div>
                        </div>

                        <div className='flex flex-col items-start justify-center w-full px-4 py-2 gap-2'>
                            <div className='h-4 w-24 bg-neutral-700 rounded' />
                            <div className='flex justify-between items-center w-full'>
                                <div className='h-5 w-40 bg-neutral-800 rounded' />
                                <div className='h-5 w-5 bg-neutral-700 rounded' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
