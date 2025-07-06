import React, { useCallback, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDispatch } from 'react-redux';
import { addMessagesToTop, setLoading } from '@/store/features/message/messageSlice';
import { toast } from 'sonner';

type GroupChatBoxProps = {
    roomId: number;
};

const GroupChatBox: React.FC<GroupChatBoxProps> = ({ roomId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const messageState = useSelector((state: RootState) => state.messages[roomId]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    const { sendGetRoomMessages, onRoomMessages, offRoomMessages } = useWebSocket();

    const messages = messageState?.messages || [];
    const isLoading = messageState?.isLoading || false;
    const hasMore = messageState?.hasMore || false;
    const currentPage = messageState?.currentPage || 1;

    const loadMoreMessages = useCallback(() => {
        if (isLoadingRef.current || !hasMore || isLoading) return;

        isLoadingRef.current = true;
        dispatch(setLoading({ roomId, isLoading: true }));

        const nextPage = currentPage + 1;
        sendGetRoomMessages(nextPage, 50);
    }, [roomId, hasMore, isLoading, currentPage, dispatch, sendGetRoomMessages]);

    const handleScroll = useCallback(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const { scrollTop } = container;

        // Load more messages when user scrolls to the top
        if (scrollTop < 100 && hasMore && !isLoadingRef.current) {
            loadMoreMessages();
        }
    }, [loadMoreMessages, hasMore]);

    useEffect(() => {
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
            dispatch(addMessagesToTop({
                roomId,
                messages: data.messages,
                pagination: data.pagination,
            }));

            toast.success(`Loaded ${data.messages.length} more messages`);
            isLoadingRef.current = false;
            dispatch(setLoading({ roomId, isLoading: false }));
        };

        onRoomMessages(handleRoomMessages);

        return () => {
            offRoomMessages(handleRoomMessages);
        };
    }, [roomId, dispatch, onRoomMessages, offRoomMessages]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container && messages.length > 0) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

            if (isNearBottom) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages.length]);

    return (
        <div
            ref={chatContainerRef}
            className='flex-1 overflow-y-auto px-4 py-2 flex flex-col space-y-2'
        >

            {isLoading && (
                <div className='flex justify-center py-2'>
                    <div className='text-sm text-neutral-400'>Loading more messages...</div>
                </div>
            )}

            {hasMore && !isLoading && (
                <div className='flex justify-center py-2'>
                    <button
                        onClick={loadMoreMessages}
                        className='text-sm text-indigo-400 hover:text-indigo-300 px-3 py-1 rounded-md border border-indigo-400/30 hover:border-indigo-400/50 transition-colors'
                    >
                        Load More Messages
                    </button>
                </div>
            )}

            {!messages || messages.length === 0 ? (
                <div className='flex items-center justify-center w-full flex-1'>
                    <div className='flex flex-col items-center justify-center rounded-md w-full'>
                        <p className='text-sm mt-4 text-neutral-400 border border-indigo-400 py-2 px-4 rounded-md'>
                            You have no chats yet
                        </p>
                        <div className='flex justify-between px-2 py-3 items-center gap-3'>
                            <p className='text-xl font-semibold text-neutral-400 mt-3'>start chatting...</p>
                            <HiMiniChatBubbleBottomCenterText
                                size={45}
                                className='text-indigo-400'
                            />
                        </div>
                    </div>
                </div>
            ) : (
                messages.map((msg, index) => {

                    const timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
                    const formattedTime = timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <MessageBubble
                            key={`${msg.id}-${index}`}
                            message={msg.content}
                            messageType={msg.userId === user?.id ? 'sent' : 'received'}
                            time={formattedTime}
                            username={msg.userId === user?.id ? 'You' : msg.username}
                        />
                    );
                })
            )}
        </div>
    );
};

export default GroupChatBox;