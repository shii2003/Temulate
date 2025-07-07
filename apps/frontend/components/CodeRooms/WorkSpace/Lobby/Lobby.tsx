import GroupChatBox from '@/components/Messages/GroupChatBox';
import MessageInputBox from '@/components/Messages/MessageInputBox';
import OnlineUsersList from '@/components/Messages/OnlineUsersList';
import { useWebSocket } from '@/hooks/useWebSocket';
import { addMessage, setMessages, setLoading } from '@/store/features/message/messageSlice';
import { setRoomMembers } from '@/store/features/room/roomSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type LobbyProps = {
    roomId: number;
};

const Lobby: React.FC<LobbyProps> = ({ roomId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { members } = useSelector((state: RootState) => state.room);
    const messageState = useSelector((state: RootState) => state.messages[roomId]);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    const {
        sendGetRoomUsers,
        sendGetRoomMessages,
        onNewMessage,
        offNewMessage,
        onUserJoined,
        offUserJoined,
        onUserLeft,
        offUserLeft,
        onRoomUsers,
        offRoomUsers,
        onRoomMessages,
        offRoomMessages
    } = useWebSocket();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        const loadInitialMessages = () => {
            if (!roomId || isInitialLoadComplete) return;

            dispatch(setLoading({ roomId, isLoading: true }));
            sendGetRoomMessages(1, 50);

            // Fallback: reset loading after 5 seconds if no response
            timeoutId = setTimeout(() => {
                dispatch(setLoading({ roomId, isLoading: false }));
            }, 5000);
        };

        loadInitialMessages();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [roomId, dispatch, isInitialLoadComplete, sendGetRoomMessages]);

    useEffect(() => {
        if (roomId) {
            sendGetRoomUsers(roomId);
        }
    }, [roomId, sendGetRoomUsers]);


    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        const handleRoomMessages = (data: {
            messages: Array<{
                id: number;
                userId: number;
                username: string;
                content: string;
                timestamp: Date;
            }>;
            pagination: {
                currentPage: number;
                totalPages: number;
                totalMessages: number;
                hasMore: boolean;
            };
        }) => {
            dispatch(setMessages({
                roomId,
                messages: data.messages,
                pagination: data.pagination,
            }));

            setIsInitialLoadComplete(true);
            dispatch(setLoading({ roomId, isLoading: false }));

            if (timeoutId) clearTimeout(timeoutId);
        };

        onRoomMessages(handleRoomMessages);

        return () => {
            offRoomMessages(handleRoomMessages);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [roomId, dispatch, onRoomMessages, offRoomMessages]);

    useEffect(() => {
        const handleNewMessage = (data: { userId: number, username: string, content: string }) => {
            dispatch(addMessage({
                roomId,
                message: {
                    id: Date.now(),
                    ...data,
                    timestamp: new Date(),
                }
            }));
        };

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
        };

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
    }, [roomId, dispatch, user, onNewMessage, offNewMessage, onUserJoined, offUserJoined, onUserLeft, offUserLeft, onRoomUsers, offRoomUsers]);

    return (
        <div className='flex bg-neutral-800 flex-col h-full w-full border-r border-neutral-700'>
            <OnlineUsersList onlineUsers={members} />
            <GroupChatBox roomId={roomId} />
            <MessageInputBox roomId={roomId} />
        </div>
    );
};

export default Lobby;

