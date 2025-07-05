"use client";

import React from 'react';

const Loading = () => {
    return (
        <div className="h-full w-full overflow-hidden animate-pulse">
            <div className="flex h-full w-full max-w-7xl mx-auto">

                <div className="flex flex-col w-3/5 min-w-5 p-2 gap-2">
                    <div className="h-12 w-full bg-neutral-700 rounded-md" />
                    <div className="h-full w-full bg-neutral-700 rounded-lg" />
                </div>


                <div className="flex flex-col w-2/5 p-2 space-y-4">
                    <div className="h-12 w-full bg-neutral-700 rounded-md" />
                    <div className="h-8 w-full bg-neutral-700 rounded-md" />
                    <div className="h-[calc(100%-5rem)] w-full bg-neutral-700 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default Loading;