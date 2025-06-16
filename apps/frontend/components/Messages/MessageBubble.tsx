import React from 'react';

type SentMessageBubbleProps = {
    username: string,
    message: string,
    time: string,
    messageType: 'sent' | 'received';
};

const truncateUsername = (username: string, maxLength: number) => {
    const ellipsis = "..."
    if (username.length > maxLength) {
        return username.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
    return username;
}

const SentMessageBubble: React.FC<SentMessageBubbleProps> = ({ message, messageType, time, username, }) => {
    const isSent = messageType == 'sent';

    return (
        <div
            className={`flex flex-col ${isSent ? 'ml-auto items-end' : 'mr-auto items-start'
                } border border-neutral-700 rounded-t-lg px-4 py-2 w-auto max-w-[75%] 
            ${isSent ? 'rounded-l-lg ' : 'rounded-r-lg '} break-all`}
        >
            <p className={`text-sm w-full ${isSent ? 'text-indigo-300' : "text-yellow-400"}`}>
                {username}
            </p>
            <p className={`${isSent ? 'text-neutral-300' : 'text-white'} break-all whitespace-pre-wrap`}>{message}</p>
            <div className="flex items-center justify-end w-full">
                <p className={`text-xs text-neutral-500 font-semibold`}>{time}</p>
            </div>
        </div>
    )
}
export default SentMessageBubble;