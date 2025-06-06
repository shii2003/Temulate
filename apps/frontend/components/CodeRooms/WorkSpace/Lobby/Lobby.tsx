import GroupChatBox from '@/components/Messages/GroupChatBox';
import MessageInputBox from '@/components/Messages/MessageInputBox';
import OnlineUsersList from '@/components/Messages/OnlineUsersList';
import { useWebSocket } from '@/hooks/useWebSocket';
import { addMessage } from '@/store/features/message/messageSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type LobbyProps = {
    roomId: number;
};

const Lobby: React.FC<LobbyProps> = ({ roomId }) => {

    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const messages = useSelector((state: RootState) => state.messages[roomId] || []);
    const [onlineUsers, setOnlineUsers] = useState<{ id: number, username: string }[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevMessageCountRef = useRef(0);
    const [isNearBottom, setIsNearBottom] = useState(true);

    const { onNewMessage, offNewMessage, onUserJoined, offUserJoined, onUserLeft, offUserLeft } = useWebSocket();

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
            setOnlineUsers(prev => {

                if (prev.some(u => u.id === data.user.id)) return prev;
                return [...prev, { id: data.user.id, username: data.user.username }];
            });
        };

        const handleUserLeft = (data: { userId: number; username: string }) => {
            setOnlineUsers(prev => prev.filter(user => user.id !== data.userId));
        };

        onNewMessage(handleNewMessage);
        onUserJoined(handleUserJoined);
        onUserLeft(handleUserLeft);

        return () => {
            offNewMessage(handleNewMessage);
            offUserJoined(handleUserJoined);
            offUserLeft(handleUserLeft);
        };
    }, [roomId, dispatch, onNewMessage, offNewMessage, onUserJoined, offUserJoined, onUserLeft, offUserLeft])

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

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const scrollToBottom = () => {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        };

        if (prevMessageCountRef.current === 0) {
            scrollToBottom();
        }

        else if (messages.length > prevMessageCountRef.current && isNearBottom) {
            scrollToBottom();
        }

        prevMessageCountRef.current = messages.length;
    }, [messages, isNearBottom]);

    return (
        <div className='flex bg-neutral-800  flex-col h-full w-full border-r border-neutral-700'>
            <OnlineUsersList onlineUsers={onlineUsers} />
            <div
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto mb-1 mt-2'>
                <GroupChatBox messages={messages} />
            </div>
            <MessageInputBox roomId={roomId} />
        </div>
    )
}
export default Lobby;