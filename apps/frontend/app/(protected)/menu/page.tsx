import UserInformation from '@/components/Sidebar/UserInformation';
import CreateNewRoomButton from '@/components/ui/buttons/CreateNewRoomButton';
import CreateNewRoomCard from '@/components/ui/Cards/CreateNewRoomCard';
import ExploreDrawingCanvasCard from '@/components/ui/Cards/ExploreDrawingCanvasCard';
import JoinRoomCard from '@/components/ui/Cards/JoinRoomCard';
import RoomInfoCard from '@/components/ui/Cards/RoomInfoCard';
import React from 'react';
import { Courgette, Noto_Sans_Mono } from 'next/font/google';

const courgette = Courgette({
    weight: '400',
    subsets: ['latin'],
});
const notoSansMono = Noto_Sans_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
});

type pageProps = {
};

const page: React.FC<pageProps> = () => {
    return (
        <div className='flex flex-1 w-full flex-col h-full overflow-hidden'>
            <div className='flex flex-col items-center px-4 py-2 gap-3 mt-9 h-full min-h-0 '>
                <div className='flex w-full items-center justify-start'>

                </div>
                <div className='flex-1 h-full items-center w-full flex flex-col min-h-0'>
                    <div className="flex items-center justify-center flex-col w-full px-2 py-4 text-center gap-2 ">
                        <div className={`text-xl md:text-3xl lg:text-5xl ${courgette.className} tracking-tighter`}>
                            <span className='text-neutral-300'>Start your own{' '}</span>
                            <span className={`font-extrabold bg-gradient-to-r from-pink-500 px-2 via-yellow-400 to-purple-500 bg-clip-text text-transparent tracking-wide ${courgette.className}`}>
                                CANVAS
                            </span>{' '}
                            <span className='text-neutral-300'>- Alone or With Friends!</span>
                        </div>
                        <p className={`text-xl md:text-2xl tracking-wide font-semibold text-neutral-300 ${courgette.className}`}>
                            Creativity begins with a click.
                        </p>
                    </div>
                    <div className='mt-2 sm:mt-4 md:mt-7 flex-1 w-full items-center  flex flex-col min-h-0 overflow-auto'>
                        <div className='flex flex-col justify-start items-start h-full px-4 py-2 gap-3 sm:gap-4 md:gap-10  w-full min-h-0 overflow-auto'>
                            <div className='w-full  flex items-center justify-center mt-4'>
                                <ExploreDrawingCanvasCard />
                            </div>
                            <div className='w-full flex  items-center justify-center gap-3 flex-wrap'>
                                <CreateNewRoomCard />
                                <JoinRoomCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page;