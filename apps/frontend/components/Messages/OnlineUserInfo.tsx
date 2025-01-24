import React from 'react';
import Image from "next/image";

type OnlineUserInfoProps = {
    username: string,
    email: string
};

const truncateUsername = (username: string, maxLength: number) => {
    if (username.length > maxLength) {
        const ellipsis = '...'
        return username.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
    return username;
}

const OnlineUserInfo: React.FC<OnlineUserInfoProps> = ({ username, email }) => {

    return (
        <div className="flex flex-col items-center justify-center gap-1 px-2 py-1  ">
            <div className="relative ">
                <Image
                    className="w-10 h-10 rounded-full"
                    alt={username}
                    src={"/masao.jpg"}
                    width={40}
                    height={40}
                />
                <div className="absolute top-0 left-7 w-3.5 h-3.5 bg-green-500 border-2 border-neutral-800 rounded-full"></div>
            </div>

            <div className='flex flex-col text-xs break-words max-w-[10ch]'>
                <p>{truncateUsername(username, 10)}</p>
            </div>
        </div>
    );
}
export default OnlineUserInfo;