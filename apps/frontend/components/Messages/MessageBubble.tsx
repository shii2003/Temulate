import React from 'react';

type SentMessageBubbleProps = {
    message: string,
    time: string,
    messageType: 'sent' | 'received';
};

const SentMessageBubble: React.FC<SentMessageBubbleProps> = ({ message, time, messageType }) => {
    const isSent = messageType == 'sent';

    return (
        <div
            className={`flex flex-col ${isSent ? 'ml-auto items-end' : 'mr-auto items-start'
                } border border-neutral-700 rounded-t-lg px-4 py-2 w-auto max-w-[75%] 
            ${isSent ? 'rounded-l-lg ' : 'rounded-r-lg '} break-words`}
        >
            <p className={`text-sm w-full ${isSent ? 'text-indigo-300' : "text-yellow-400"}`}>
                {isSent ? "You" : "User"}
            </p>
            <p className={`${isSent ? 'text-neutral-300' : 'text-white'}`}>{message}</p>
            <div className="flex items-center justify-end w-full">
                <p className={`text-xs text-neutral-500 font-semibold`}>{time}</p>
            </div>
        </div>
    )
}
export default SentMessageBubble;