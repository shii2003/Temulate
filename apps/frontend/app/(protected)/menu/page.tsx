
import CreateNewRoomButton from '@/components/ui/buttons/CreateNewRoomButton';
import CreateNewRoomCard from '@/components/ui/Cards/CreateNewRoomCard';
import JoinRoomCard from '@/components/ui/Cards/JoinRoomCard';
import RoomInfoCard from '@/components/ui/Cards/RoomInfoCard';
import { CreateAndEnterRoom } from '@/components/ui/modals/CreateAndEnterRoom';
import React from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    return (
        <div className='flex flex-1  w-full  flex-col border-2 h-full border-blue-300 '>

            <div className=' flex items-center  px-4 py-2 gap-3 mt-9 flex-wrap'>

                <RoomInfoCard
                    roomId={4}
                    roomName='Room1'
                />
                {/* <CreateAndEnterRoom /> */}
                <CreateNewRoomCard />
                <JoinRoomCard />
            </div>
        </div>
    )
}
export default page;