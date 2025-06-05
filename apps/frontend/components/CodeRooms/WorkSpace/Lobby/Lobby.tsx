import GroupChatBox from '@/components/Messages/GroupChatBox';
import MessageInputBox from '@/components/Messages/MessageInputBox';
import OnlineUserInfo from '@/components/Messages/OnlineUserInfo';
import OnlineUsersList from '@/components/Messages/OnlineUsersList';
import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';

type LobbyProps = {
    roomId: number;
};

const users = [
    { id: 1, name: 'Masao', email: 'masao@example.com', imageSrc: '/masao.jpg' },
    { id: 2, name: 'John Doe', email: 'john@example.com', imageSrc: '/john.jpg' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
];

const Lobby: React.FC<LobbyProps> = ({ roomId }) => {



    return (
        <div className='flex bg-neutral-800  flex-col h-full w-full border-r border-neutral-700'>
            {/* <OnlineUsersList onlineUsers={onlineUsers} /> */}
            <div className='flex-1 overflow-y-auto mb-1 mt-2'>
                <GroupChatBox />
            </div>
            <MessageInputBox roomId={roomId} />
        </div>
    )
}
export default Lobby;