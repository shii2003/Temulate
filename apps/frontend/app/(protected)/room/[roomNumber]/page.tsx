"use client";
import RealtimeCanvas from '@/components/CodeRooms/Canvas/RealtimeCanvas';
import Lobby from '@/components/CodeRooms/WorkSpace/Lobby/Lobby';
import Workspace from '@/components/CodeRooms/WorkSpace/Workspace';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import React, { use, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { string } from 'zod';

interface PageProps {

}

const page: React.FC<PageProps> = () => {

    const params = useParams<{ roomNumber: string }>();
    const roomId = params.roomNumber;
    const numericRoomNumber = Number(params.roomNumber);
    const currentRoomName = useSelector((state: RootState) => state.room.currentRoomName)

    const { booleanIsConnected, sendJoinRoom } = useWebSocket();

    useEffect(() => {
        if (booleanIsConnected && currentRoomName && params.roomNumber) {
            sendJoinRoom(currentRoomName);
        }
    }, [booleanIsConnected, currentRoomName, params.roomNumber, sendJoinRoom]);

    return (
        <div className='h-full overflow-hidden w-full '>
            <div className='flex w-full h-full  max-w-7xl mx-auto'>
                <div className=' w-3/5  min-w-5 '>
                    <RealtimeCanvas roomId={numericRoomNumber} />
                </div>
                <div className='w-2/5'>
                    <Lobby roomId={numericRoomNumber} />
                </div>
            </div>
        </div>
    )
}
export default page;