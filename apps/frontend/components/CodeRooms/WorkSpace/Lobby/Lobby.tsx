import GroupChatBox from '@/components/Messages/GroupChatBox';
import MessageInputBox from '@/components/Messages/MessageInputBox';
import OnlineUsersList from '@/components/Messages/OnlineUsersList';
import { useWebSocket } from '@/hooks/useWebSocket';
import { addMessage } from '@/store/features/message/messageSlice';
import { setRoomMembers } from '@/store/features/room/roomSlice';
import { RootState } from '@/store/store';
import { on } from 'events';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type LobbyProps = {
    roomId: number;
};

// export type userListType = {
//     id: number;
//     username: string;
// }

// export type CurrentRoomUserList = {
//     users: userListType[];
// }

const Lobby: React.FC<LobbyProps> = ({ roomId }) => {

    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.auth);
    const { members } = useSelector((state: RootState) => state.room)
    // const messages = useSelector((state: RootState) => state.messages[roomId] || []);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevMessageCountRef = useRef(0);
    const [isNearBottom, setIsNearBottom] = useState(true);


    const { sendGetRoomUsers, onNewMessage, offNewMessage, onUserJoined, offUserJoined, onUserLeft, offUserLeft, onRoomUsers, offRoomUsers } = useWebSocket();

    useEffect(() => {
        if (roomId) {
            sendGetRoomUsers(roomId);
        }
    }, [roomId]);

    useEffect(() => {
        const handleNewMessage = (data: { userId: number, username: string, content: string }) => {
            dispatch(addMessage({
                roomId,
                message: {
                    ...data,
                    timestamp: new Date(),
                }
            }));
        }

        const handleUserJoined = (data: { user: { id: number; username: string } }) => {

            if (user && data.user.id !== user.id) {
                toast.success(`New user ${data.user.username} joined.`);
            }
        };

        const handleUserLeft = (data: { userId: number; username: string }) => {

            toast.info(`User ${data.username} left the room.`);
        };

        const handleRoomUser = (data: { users: { id: number; username: string }[] }) => {
            dispatch(setRoomMembers(data.users));
        }

        onNewMessage(handleNewMessage);
        onUserJoined(handleUserJoined);
        onUserLeft(handleUserLeft);
        onRoomUsers(handleRoomUser);
        return () => {
            offNewMessage(handleNewMessage);
            offUserJoined(handleUserJoined);
            offUserLeft(handleUserLeft);
            offRoomUsers(handleRoomUser);
        };
    }, [roomId, dispatch, onNewMessage, offNewMessage, onUserJoined, offUserJoined, onUserLeft, offUserLeft, onRoomUsers, offRoomUsers])

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
            const threshold = 100;
            const { scrollTop, scrollHeight, clientHeight } = chatContainer;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            setIsNearBottom(distanceFromBottom <= threshold);
        };

        chatContainer.addEventListener('scroll', handleScroll);

        return () => chatContainer.removeEventListener('scroll', handleScroll);
    }, []);

    // useEffect(() => {
    //     const chatContainer = chatContainerRef.current;
    //     if (!chatContainer) return;

    //     const scrollToBottom = () => {
    //         chatContainer.scrollTo({
    //             top: chatContainer.scrollHeight,
    //             behavior: 'smooth'
    //         });
    //     };

    //     if (prevMessageCountRef.current === 0) {
    //         scrollToBottom();
    //     }

    //     else if (messages.length > prevMessageCountRef.current && isNearBottom) {
    //         scrollToBottom();
    //     }

    //     prevMessageCountRef.current = messages.length;
    // }, [messages, isNearBottom]);

    return (
        <div className='flex bg-neutral-800  flex-col h-full w-full border-r border-neutral-700'>
            <OnlineUsersList onlineUsers={members} />
            <div
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto mb-1 mt-2'>
                {/* <GroupChatBox messages={messages} /> */}
            </div>
            <MessageInputBox roomId={roomId} />
        </div>
    )
}
export default Lobby;

