"use client";
import React from 'react';

type loadingProps = {

};

const loading: React.FC<loadingProps> = () => {

    return (
        <div className='flex flex-1  w-full  flex-col border-2 h-full border-blue-300 '>
            <div className='flex flex-col gap-4 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 w-56 animate-pulse' >

            </div>
        </div>
    )
}
export default loading;