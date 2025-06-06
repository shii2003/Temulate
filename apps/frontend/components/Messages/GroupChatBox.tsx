import React from 'react';
import SentMessageBubble from './MessageBubble';
import MessageBubble from './MessageBubble';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";

type GroupChatBoxProps = {
    messages: Array<{
        userId: number;
        username: string;
        content: string;
        timestamp: Date | string;
    }>;
};

const GroupChatBox: React.FC<GroupChatBoxProps> = ({ messages }) => {

    const { user } = useSelector((state: RootState) => state.auth);

    // const messages = [
    //     { content: "Hey! How are you?", userId: 2 },
    //     { content: "I'm good, thanks! How about you?", userId: 1 },
    //     { content: "Doing great, just working on the project.", userId: 2 },
    //     { content: "Same here, making good progress?", userId: 1 },
    //     { content: "Yeah, almost done with the UI.", userId: 2 },
    //     { content: "Awesome! Let me know if you need help.", userId: 1 },
    //     { content: "Will do! What part are you working on?", userId: 2 },
    //     { content: "I'm handling the backend APIs right now.", userId: 1 },
    //     { content: "Nice! Are we using JWT for auth?", userId: 2 },
    //     { content: "Yep, JWT with refresh tokens.", userId: 1 },
    // ];
    return (
        <div className=' px-4 py-2 flex flex-col space-y-2 '>

            {!messages || messages.length === 0 ? (
                <div
                    className='flex items-center justify-center w-full'
                >
                    <div className='flex flex-col items-center justify-center  rounded-md w-full'>
                        <p className='text-sm mt-4 text-neutral-400 border border-indigo-400 py-2 px-4 rounded-md'>
                            You have no chats yet
                        </p>
                        <div className='flex justify-between px-2 py-3 items-center gap-3'
                        >
                            <p className='text-xl font-semibold text-neutral-400 mt-3'>start chatting...</p>
                            <HiMiniChatBubbleBottomCenterText size={45}
                                className='text-indigo-400' />
                        </div>
                    </div>
                </div>
            ) : (
                messages.map((msg, index) => {
                    // Convert to Date if needed and format time
                    const timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
                    const formattedTime = timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <MessageBubble
                            key={index}
                            message={msg.content}
                            messageType={msg.userId === user?.id ? 'sent' : 'received'}
                            time={formattedTime}
                            username={msg.userId === user?.id ? 'You' : msg.username}
                        />
                    );
                })
            )}
        </div>
    )
}
export default GroupChatBox;