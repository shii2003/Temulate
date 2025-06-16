import React from 'react';
import Image from "next/image";

type OnlineUserInfoProps = {
    username: string,
    userId: number,
    imageSrc?: string
    // email: string
};

const truncateUsername = (username: string, maxLength: number) => {
    if (username.length > maxLength) {
        const ellipsis = '...'
        return username.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
    return username;
}

const OnlineUserInfo: React.FC<OnlineUserInfoProps> = ({ username, userId, imageSrc }) => {

    const avatarColors = [
        'bg-red-400', 'bg-blue-400', 'bg-green-400',
        'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
    ];

    const safeUserId = Number.isInteger(userId) ? userId : 0;
    const colorIndex = Math.abs(safeUserId) % avatarColors.length;
    const bgColor = avatarColors[colorIndex];

    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="flex flex-col items-center justify-center gap-1 px-2 py-1  ">
            <div className="relative ">
                {imageSrc ? (
                    <Image
                        className="w-10 h-10 rounded-full"
                        alt={username}
                        src={"/masao.jpg"}
                        width={40}
                        height={40}
                    />
                ) : (
                    <div></div>
                )
                }
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
                    <span className="font-bold text-white">{initials.substring(0, 2)}</span>
                </div>
            </div>

            <div className='flex flex-col text-xs break-words w-[10ch]'>
                <p>{truncateUsername(username, 10)}</p>
            </div>
        </div>
    );
}
export default OnlineUserInfo;