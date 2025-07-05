'use client';
import React from 'react';

const Loading = () => {
    return (
        <div className='flex flex-col h-full w-full'>

            <div className='h-16 w-full border-b border-neutral-800 px-3 py-1 flex items-center justify-between gap-2 bg-neutral-800'>
                <div className="flex gap-3 w-full justify-between">

                    <div className="flex gap-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="h-8 w-10 bg-neutral-700 rounded-md animate-pulse" />
                        ))}
                    </div>


                    <div className="flex gap-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="h-8 w-8 bg-neutral-700 rounded-md animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>


            <div className='relative flex-1 px-4 py-2 bg-neutral-900 overflow-hidden'>
                <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] border border-neutral-700 rounded-md bg-neutral-800 animate-pulse" />
            </div>
        </div>
    );
};

export default Loading;
