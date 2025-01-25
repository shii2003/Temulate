import React from 'react';
import SentMessageBubble from './MessageBubble';
import MessageBubble from './MessageBubble';

type GroupChatBoxProps = {

};

const GroupChatBox: React.FC<GroupChatBoxProps> = () => {

    const messages = [
        { message: "Hello!", time: "10:00 AM", messageType: "received" },
        { message: "Hi! How are you doing?", time: "10:01 AM", messageType: "sent" },
        { message: "I'm doing great! Thanks for asking.", time: "10:02 AM", messageType: "received" },
        { message: "What about you?", time: "10:03 AM", messageType: "received" },
        { message: "I'm good too, just been busy with work.", time: "10:04 AM", messageType: "sent" },
        { message: "I hear you! Work has been crazy on my end as well.", time: "10:05 AM", messageType: "received" },
        { message: "Did you check out the new feature update?", time: "10:06 AM", messageType: "sent" },
        { message: "Yes, I did! It's super impressive.", time: "10:07 AM", messageType: "received" },
        { message: "Yeah, they really outdid themselves this time!", time: "10:08 AM", messageType: "sent" },
        { message: "Agreed! We should test it out together sometime.", time: "10:09 AM", messageType: "received" },
        { message: "Absolutely, let's plan for next week.", time: "10:10 AM", messageType: "sent" },
        { message: "Sounds good! I'll sync up with you then.", time: "10:11 AM", messageType: "received" },
        { message: "Perfect! Have a great day ahead.", time: "10:12 AM", messageType: "sent" },
        { message: "Thanks, you too! Take care.", time: "10:13 AM", messageType: "received" },
        { message: "Bye!", time: "10:14 AM", messageType: "sent" }
    ];
    return (
        <div className=' px-4 py-2 flex flex-col space-y-2 '>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    message={msg.message}
                    messageType={msg.messageType as 'sent' | 'received'}
                    time={msg.time}
                />
            ))}
        </div>
    )
}
export default GroupChatBox;