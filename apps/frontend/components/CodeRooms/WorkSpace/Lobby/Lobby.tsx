import GroupChatBox from '@/components/Messages/GroupChatBox';
import OnlineUsersScroll from '@/components/utils/OnlineUsersScroll';
import React from 'react';

type LobbyProps = {

};

const Lobby: React.FC<LobbyProps> = () => {

    return (
        <div className=' h-full '>
            <OnlineUsersScroll />
            <div className='flex-1 overflow-y-auto'>
                <GroupChatBox />
            </div>
        </div>
    )
}
export default Lobby;