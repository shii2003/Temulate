import React from 'react';

type SizeSelectorModelProps = {
    setBrushSize: React.Dispatch<React.SetStateAction<number>>;
};

const sizes = [6, 8, 10, 12, 14, 16, 19, 22];

const SizeSelectorModel: React.FC<SizeSelectorModelProps> = ({ setBrushSize }) => {

    return (
        <div className='flex items-center justify-center rounded-md w-52 border border-neutral-700 bg-neutral-900 ml-7 px-3 py-2 '>
            <div className='flex flex-col items-center justify-center w-full '>
                <p className='text-neutral-400 w-full'>Brush size</p>
                <div className='flex flex-col items-center w-full   gap-3 p-2 '>

                    {
                        Array.from({ length: Math.ceil(sizes.length / 4) }, (_, rowIndex) => (
                            <div
                                key={rowIndex}
                                className='items-end justify-start w-full flex gap-3 px-2 py-1'
                            >
                                {sizes.slice(rowIndex * 4, (rowIndex * 4) + 4).map((sizeInPixel, index) => (
                                    <div key={index}
                                        className='flex w-8 h-8 items-end justify-start'
                                    >
                                        <button
                                            key={index}
                                            className="bg-indigo-400  rounded-full border border-neutral-600 focus:ring-2 focus:ring-indigo-300"
                                            style={{ height: `${sizeInPixel}px`, width: `${sizeInPixel}px` }}
                                            onClick={() => { setBrushSize(sizeInPixel) }}
                                        >

                                        </button>
                                    </div>

                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default SizeSelectorModel;