import GroupChatBox from '@/components/Messages/GroupChatBox';
import MessageInputBox from '@/components/Messages/MessageInputBox';
import OnlineUserInfo from '@/components/Messages/OnlineUserInfo';
import OnlineUsersList from '@/components/Messages/OnlineUsersList';
import React from 'react';

type LobbyProps = {

};

const users = [
    { id: 1, name: 'Masao', email: 'masao@example.com', imageSrc: '/masao.jpg' },
    { id: 2, name: 'John Doe', email: 'john@example.com', imageSrc: '/john.jpg' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
];

const Lobby: React.FC<LobbyProps> = () => {

    return (
        <div className='flex bg-neutral-800  flex-col h-full w-full'>
            <OnlineUsersList />
            <div className='flex-1 overflow-y-auto mb-1 mt-2'>
                <GroupChatBox />
            </div>
            <MessageInputBox />
        </div>
    )
}
export default Lobby;