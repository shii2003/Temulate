import React from 'react';
import SentMessageBubble from './MessageBubble';
import MessageBubble from './MessageBubble';
import { useWebSocket } from '@/hooks/useWebSocket';

type GroupChatBoxProps = {

};

const GroupChatBox: React.FC<GroupChatBoxProps> = () => {

    // const { messages } = useWebSocket();

    const messages = [
        { content: "Hey! How are you?", userId: 2 },
        { content: "I'm good, thanks! How about you?", userId: 1 },
        { content: "Doing great, just working on the project.", userId: 2 },
        { content: "Same here, making good progress?", userId: 1 },
        { content: "Yeah, almost done with the UI.", userId: 2 },
        { content: "Awesome! Let me know if you need help.", userId: 1 },
        { content: "Will do! What part are you working on?", userId: 2 },
        { content: "I'm handling the backend APIs right now.", userId: 1 },
        { content: "Nice! Are we using JWT for auth?", userId: 2 },
        { content: "Yep, JWT with refresh tokens.", userId: 1 },
    ];
    return (
        <div className=' px-4 py-2 flex flex-col space-y-2 '>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    message={msg.content}
                    messageType={msg.userId === 1 ? 'sent' : 'received'}
                    time={"11:21 PM"}
                />
            ))}
        </div>
    )
}
export default GroupChatBox;