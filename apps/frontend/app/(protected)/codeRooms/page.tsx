import RoomInfoCard from '@/components/ui/Cards/RoomInfoCard';
import Chat from '@/components/ui/Cards/WebSocketClientCard';
import WebSocketClientCard from '@/components/ui/Cards/WebSocketClientCard';
import React from 'react';

const page: React.FC = () => {

    return (
        <div className='  flex-1 mt-7 ml-4 px-4 py-2 flex  content-start gap-3 flex-wrap '>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <div className=' h-fit'>
                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
            </div>
            <Chat />

        </div>
    )
}
export default page;