import Link from 'next/link';
import React from 'react';
import { MdColorLens } from "react-icons/md";

type ExploreDrawingCanvasCardProps = {

};

const ExploreDrawingCanvasCard: React.FC<ExploreDrawingCanvasCardProps> = () => {

    return (
        <div
            className='flex justify-center items-center min-w-56 max-w-96 w-full h-40 rounded-md '
            style={{
                backgroundImage: "url('/cartographer.png')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                WebkitMaskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                maskImage:
                    'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
            }}
        >
            <Link
                href={"/canvas"}>
                <div
                    tabIndex={0}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-neutral-600 hover:bg-neutral-800 focus:bg-neutral-800 
                transform transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110 cursor-pointer"
                >
                    <p className="transition duration-300">explore the drawing canvas</p>
                    <MdColorLens className="transition duration-300" />
                </div>
            </Link>
        </div>
    )
}
export default ExploreDrawingCanvasCard;