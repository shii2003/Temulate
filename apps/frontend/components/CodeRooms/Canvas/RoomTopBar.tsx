import ExitRoomButton from '@/components/ui/buttons/ExitRoomButton';
import { RootState } from '@/store/store';
import React, { useRef, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { FaRegCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';


type RoomTopBarProps = {
    setIsLeaveRoomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomTopBar: React.FC<RoomTopBarProps> = ({ setIsLeaveRoomOpen }) => {

    const user = useSelector((state: RootState) => state.auth.user);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const roomName = useSelector((state: RootState) => state.room.currentRoomName);
    const [isCopied, setIsCopied] = useState(false);

    const isRoomNameLoding = !roomName;

    const copyToClipboard = (text: string) => {
        if (!text) {
            toast.error("No room name to copy!");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success("Room name copied to clipboard!");
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
            })
            .catch(() => {
                toast.error("Failed to copy room name. Try again!");
            });
    }
    return (
        <div
            className='flex w-full h-12 px-2 py-1  items-center justify-between bg-neutral-800 border-b border-neutral-600'
            style={{
                backgroundImage: "url('/cartographer.png')",
                backgroundSize: '300px 300px',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center',
                WebkitMaskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                maskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
            }}
        >
            <div className='hidden md:block  items-center justify-center border-2 border-neutral-600 bg-neutral-700/30 px-4 py-0.5 rounded-md text-sm'>
                {isLoading ? (
                    <div className='h-[20px] w-24 bg-neutral-600 rounded-md animate-pulse' >
                    </div>
                ) : (
                    <p className='truncate'>{user?.username}</p>
                )}
            </div>
            <div className='flex items-center justify-center gap-2 border-2 border-indigo-400/50 bg-neutral-600/20 px-2 py-0.5 rounded-md text-white'>
                {isRoomNameLoding ? (
                    <div className='px-2 h-8 w-24 py-0.5 rounded-md bg-neutral-600 animate-pulse'>

                    </div>
                ) : (<div className='px-2 py-0.5 rounded-md truncate'>
                    {roomName}
                </div>)}

                <button
                    disabled={isRoomNameLoding}
                    className='hover:scale-105 transition-all duration-200 hover:text-indigo-300 text-indigo-400/50'
                    onClick={() => copyToClipboard(roomName || '')}
                >
                    {
                        isCopied ? (
                            <FaRegCheckCircle className='text-green-400' />
                        ) : (
                            <FaRegCopy className='' />
                        )}

                </button>
            </div>
            <div className='flex items-center justify-center'>
                <ExitRoomButton setIsLeaveRoomOpen={setIsLeaveRoomOpen} />
            </div>
        </div>
    )
}
export default RoomTopBar;