"use client";
import RealtimeCanvas from '@/components/CodeRooms/Canvas/RealtimeCanvas';
import RoomTopBar from '@/components/CodeRooms/Canvas/RoomTopBar';
import Lobby from '@/components/CodeRooms/WorkSpace/Lobby/Lobby';
import Workspace from '@/components/CodeRooms/WorkSpace/Workspace';
import LeaveRoomModal from '@/components/ui/modals/LeaveRoomModal';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useParams, usePathname } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface PageProps {

}

const page: React.FC<PageProps> = () => {

    const params = useParams<{ roomNumber: string }>();
    const roomId = params.roomNumber;
    const pathname = usePathname();
    const numericRoomNumber = Number(params.roomNumber);
    const currentRoomName = useSelector((state: RootState) => state.room.currentRoomName)
    const isPathName = pathname.startsWith('/room/');
    const [isLeaveRoomOpen, setIsLeaveRoomOpen] = useState(false);

    const { booleanIsConnected, sendJoinRoom } = useWebSocket();

    useEffect(() => {
        console.log("JoinRoom useEffect fired", {
            booleanIsConnected,
            currentRoomName,
            params: params.roomNumber,
            pathname,
            isPathName
        });
        if (booleanIsConnected && currentRoomName && params.roomNumber && isPathName) {
            sendJoinRoom(currentRoomName);
        }
    }, [booleanIsConnected, currentRoomName, params.roomNumber, sendJoinRoom]);

    return (
        <div className='h-full  w-full'>
            <div className='flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto'>

                <div className='flex flex-col w-full md:w-3/5 md:min-w-5'>

                    <div className='flex '>
                        <RoomTopBar setIsLeaveRoomOpen={setIsLeaveRoomOpen} />
                    </div>

                    <div className='flex-1 min-h-0 '>
                        <RealtimeCanvas roomId={numericRoomNumber} />
                    </div>
                </div>

                <div className='w-full md:w-2/5 flex-1 md:flex-none min-h-0 '>
                    <Lobby roomId={numericRoomNumber} />
                </div>
            </div>
            {isLeaveRoomOpen && <LeaveRoomModal setIsLeaveRoomOpen={setIsLeaveRoomOpen} />}
        </div>
    )
}
export default page;