"use client";
import Workspace from '@/components/CodeRooms/WorkSpace/Workspace';
import { useParams } from 'next/navigation';
import React, { use } from 'react';

interface PageProps {

}

const page: React.FC<PageProps> = () => {

    const params = useParams<{ roomNumber: string }>();
    const numericRoomNumber = Number(params.roomNumber);
    return (
        <div className='h-full overflow-hidden w-full '>
            <Workspace roomId={numericRoomNumber} />
        </div>
    )
}
export default page;