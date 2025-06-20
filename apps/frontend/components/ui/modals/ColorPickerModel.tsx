"use client";
import React, { useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

type ColorPickerModelProps = {
    selectedColor: string;
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};

const ColorPickerModel: React.FC<ColorPickerModelProps> = ({ selectedColor, setSelectedColor }) => {

    const [hexCodeInput, setHexCodeInput] = useState<string>('');
    const [isHexColorSet, setIsHexColorSet] = useState<boolean>(false);

    const handleSet = () => {
        setSelectedColor(hexCodeInput);

        setIsHexColorSet(true);

        setTimeout(() => {
            setIsHexColorSet(false);
        }, 2000);
    }

    const defaultColors = [
        "#FADADD", // Pastel Pink
        "#AEC6CF", // Pastel Blue
        "#BFD8B8", // Pastel Green
        "#FFFACD", // Pastel Yellow
        "#D7BDE2", // Pastel Purple
        "#FFDAB9", // Pastel Orange
        "#AAF0D1", // Pastel Mint
        "#E6DAF1", // Pastel Lilac
        "#FFD1BA", // Pastel Peach
        "#B2DFDB", // Pastel Teal
        "#FFFFFF", // White
        "#000000", // Black
    ]

    return (
        <div className='flex flex-col items-center justify-center rounded-md w-52 '>
            <div className='felx flex-col border border-neutral-700 px-3 py-2 w-52 bg-neutral-800/30  gap-2 rounded-md '>
                <div className='flex flex-col gap-2  py-2'>
                    <p className='text-neutral-400'>Default colors</p>
                    {
                        Array.from({ length: Math.ceil(defaultColors.length / 5) }, (_, rowIndex) => (
                            <div key={rowIndex} className='flex gap-3'>
                                {defaultColors
                                    .slice(rowIndex * 5, rowIndex * 5 + 5)
                                    .map((color, index) => (
                                        <button
                                            key={index}
                                            className='text-sm  h-5 w-5 rounded-md  border border-neutral-700 focus:ring-2 focus:ring-indigo-600'
                                            style={{ backgroundColor: color }}
                                            onClick={() => { setSelectedColor(color) }}
                                        >
                                        </button>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
                <div className='flex flex-col gap-1 py-2'>
                    <p className='text-neutral-400'>Color Wheel</p>
                    <div className='w-full border border-neutral-700 rounded-md h-7'>

                    </div>
                </div>
                <div className='flex flex-col gap-2 py-2'>
                    <p className='text-neutral-400'>Hex code</p>
                    <div className='flex w-full gap-2 '>
                        <input
                            value={hexCodeInput}
                            className='flex-1 border border-neutral-700 rounded-md w-32 bg-neutral-800/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-2 py-1 text-neutral-300 placeholder-neutral-600'
                            placeholder='#0000'
                            onChange={(e) => setHexCodeInput(e.target.value)}
                        >

                        </input>
                        <button
                            className={`flex items-center justify-center rounded-md px-2 py-1  bg-indigo-400/60 hover:bg-indigo-400/30 focus:ring-2 focus:ring-indigo-400`}
                            onClick={handleSet}
                        >
                            {isHexColorSet ? (
                                <FaRegCheckCircle
                                    className='text-green-400'
                                    size={20} />

                            ) : (
                                <p> Set</p>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ColorPickerModel;