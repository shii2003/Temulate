"use client";
import Workspace from '@/components/CodeRooms/WorkSpace/Workspace';
import React from 'react';

interface PageProps {
    params: {
        roomNumber: string;
    }
}

const page: React.FC<PageProps> = ({ params }) => {



    return (
        <div className='h-full overflow-hidden w-full '>
            <Workspace />
        </div>
    )
}
export default page;