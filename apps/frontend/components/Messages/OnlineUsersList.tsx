import React, { useState } from 'react';
import OnlineUserInfo from './OnlineUserInfo';
import { MdOutlineNavigateBefore } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";

type OnlineUsersListProps = {

};
const users = [
    { id: 1, name: 'Masaooooooooooo', email: 'masao@example.com', imageSrc: '/masao.jpg' },
    { id: 2, name: 'John Doe', email: 'john@example.com', imageSrc: '/john.jpg' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 13, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 4, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 5, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 6, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 7, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 8, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 9, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 10, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 11, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
    { id: 12, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },


];

const OnlineUsersList: React.FC<OnlineUsersListProps> = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, users.length - 1));
    }

    return (
        <div className='relative flex flex-col items-center gap-1  border-b border-neutral-700 h-[8rem]'>

            <div className='flex items-center  text-sm h-[3rem] px-4 py-1 gap-2 w-full text-indigo-300 font-medium'>
                <p className='text-neutral-500'>Online Users: </p>
                <p className='px-4 py-1 rounded-2xl shadow-sm shadow-neutral-500 font-semibold text-base'>{users.length}</p>
            </div>
            <div className='flex flex-grow relative items-center gap-2 w-full'>
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 z-10 p-2  flex h-full  justify-center items-center bg-neutral-800  transition ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <MdOutlineNavigateBefore
                        style={{ fontSize: 24 }}
                        className='text-neutral-600 h-6 w-6' />
                </button>

                <div className="flex gap-1 overflow-hidden w-full px-10 justify-start">
                    <div
                        className='flex transition-transform duration-300'
                        style={{
                            transform: `translateX(-${currentIndex * 100}px)`
                        }}
                    >
                        {users.map((user) => (
                            <OnlineUserInfo
                                key={user.id}
                                username={user.name}
                                email={user.email}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === users.length - 1}
                    className={`h-full bg-neutral-800 absolute right-0 z-10 p-2 flex justify-center items-center  transition ${currentIndex === users.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}

                >
                    <MdOutlineNavigateNext
                        style={{ fontSize: 20 }}
                        className='text-neutral-600 h-6 w-6' />
                </button>

            </div>
        </div>

    )
}
export default OnlineUsersList;