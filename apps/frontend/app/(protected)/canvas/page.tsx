import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import React from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    return (
        <div className='flex flex-col  h-full w-full'>
            <div className='flex'>
                <CanvasTopBar />
            </div>
            <div className='flex-1 border border-red-500 '>

            </div>
        </div>
    )
}
export default page;