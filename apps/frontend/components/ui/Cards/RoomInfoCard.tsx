import React from 'react';
import EnterRoom from '../buttons/EnterRoom';
import DeleteCodeRoom from '../buttons/DeleteCodeRoom';

type RoomInfoCardProps = {
    roomId: number,
    roomName: string,
    members?: number,
};

const RoomInfoCard: React.FC<RoomInfoCardProps> = ({ roomId, roomName, members }) => {

    return (
        <div className=' flex flex-col gap-4 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 w-56' >
            <div className='border flex justify-center border-neutral-700 px-4 py-2 rounded-md font-bold text-xl text-neutral-400  bg-neutral-700'>
                {roomName || "room1"}
            </div>
            <div className='flex flex-col gap-3 font-medium text-sm justify-between text-neutral-500'>
                <div className='flex  gap-1 flex-col justify-start'>
                    <div className='flex gap-2 items-center justify-start'>
                        <span className='w-2 h-2 rounded-full flex items-center justify-center bg-green-500'></span>
                        <p>Members: 2</p>
                    </div>
                    <div className='flex gap-2 items-center justify-start'>
                        <span className='w-2 h-2 rounded-full flex items-center justify-start '></span>
                        <p > roomId: {roomId}</p>
                    </div>
                </div>
                <div className='flex gap-2 justify-end'>

                    <EnterRoom />
                </div>
            </div>
        </div>
    )
}
export default RoomInfoCard;