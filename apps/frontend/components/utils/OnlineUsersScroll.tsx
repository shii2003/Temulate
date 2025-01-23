import React from 'react';
import Image from "next/image";

type OnlineUsersScrollProps = {

};

const OnlineUsersScroll: React.FC<OnlineUsersScrollProps> = () => {

    return (
        <div className='flex flex-row px-4 py-2'>
            <div className="relative me-4">
                <Image
                    className="w-10 h-10 rounded-full"
                    alt='masao1'
                    src="/masao.jpg"
                    width={40}
                    height={40}
                />
                <div className="absolute top-0 left-7 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="relative me-4">
                <Image
                    className="w-10 h-10 rounded-full"
                    alt='masao1'
                    src="/masao.jpg"
                    width={40}
                    height={40}
                />
                <div className="absolute top-0 left-7 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="relative me-4">
                <Image
                    className="w-10 h-10 rounded-full"
                    alt='masao1'
                    src="/masao.jpg"
                    width={40}
                    height={40}
                />
                <div className="absolute top-0 left-7 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="relative me-4">
                <Image
                    className="w-10 h-10 rounded-full"
                    alt='masao1'
                    src="/masao.jpg"
                    width={40}
                    height={40}
                />
                <div className="absolute top-0 left-7 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
        </div>
    );
}
export default OnlineUsersScroll;