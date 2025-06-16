import React, { useEffect, useRef, useState } from 'react';
import OnlineUserInfo from './OnlineUserInfo';
import { MdOutlineNavigateBefore } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";

export interface User {
    id: number;
    username: string
}

type OnlineUsersListProps = {
    onlineUsers: User[],
};

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ onlineUsers }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState(0);


    useEffect(() => {
        const calculateVisibleItems = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;

                const items = Math.floor(containerWidth / 80);
                setVisibleItems(Math.max(items, 1));
            }
        };

        calculateVisibleItems();
        window.addEventListener('resize', calculateVisibleItems);

        return () => {
            window.removeEventListener('resize', calculateVisibleItems);
        };
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(prev + 1, Math.max(onlineUsers.length - visibleItems, 0)));
    }

    const showPrev = currentIndex > 0;
    const showNext = currentIndex < Math.max(onlineUsers.length - visibleItems, 0);

    return (
        <div className='relative flex flex-col items-center gap-1 border-b border-neutral-700 h-[8rem]'>
            <div className='flex items-center text-sm h-[3rem] px-4 py-1 gap-2 w-full text-indigo-300 font-medium'>
                <p className='text-neutral-500'>Online Users: </p>
                <p className='px-4 py-1 rounded-2xl shadow-sm shadow-neutral-600 font-semibold text-base'>
                    {onlineUsers.length}
                </p>
            </div>

            <div className='flex flex-grow relative items-center gap-2 w-full' ref={containerRef}>
                {showPrev && (
                    <button
                        onClick={handlePrev}
                        className='absolute left-0 z-10 p-2 flex h-full justify-center items-center bg-neutral-800 hover:bg-neutral-700 transition'
                    >
                        <MdOutlineNavigateBefore className='text-neutral-400 h-6 w-6' />
                    </button>
                )}

                <div className="flex gap-1 overflow-hidden w-full px-4 justify-start">
                    <div
                        className='flex transition-transform duration-300'
                        style={{
                            transform: `translateX(-${currentIndex * 84}px)`
                        }}
                    >
                        {onlineUsers.map((user) => (
                            <OnlineUserInfo
                                key={user.id}
                                username={user.username}
                                userId={user.id}
                            />
                        ))}
                    </div>
                </div>

                {showNext && (
                    <button
                        onClick={handleNext}
                        className='h-full bg-neutral-800 hover:bg-neutral-700 absolute right-0 z-10 p-2 flex justify-center items-center transition'
                    >
                        <MdOutlineNavigateNext className='text-neutral-400 h-6 w-6' />
                    </button>
                )}
            </div>
        </div>
    )
}
export default OnlineUsersList;