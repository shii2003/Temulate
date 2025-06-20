'use client';
import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import ColorPickerModel from '@/components/ui/modals/ColorPickerModel';
import React, { useState } from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    const [selectedColor, setSelectedColor] = useState<string>("#000000");

    return (
        <div className='flex flex-col  h-full w-full'>
            <div className='flex'>
                <CanvasTopBar selectedColor={selectedColor} />
            </div>
            <div className='flex-1 border border-red-500 '>
                <ColorPickerModel
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                />
            </div>
        </div>
    )
}
export default page;