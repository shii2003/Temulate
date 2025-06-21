'use client';
import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import ColorPickerModel from '@/components/ui/modals/ColorPickerModel';
import React, { useEffect, useRef, useState } from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    const [selectedColor, setSelectedColor] = useState<string>("#000000");
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const colorPickerButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                colorPickerRef.current &&
                colorPickerButtonRef.current &&
                !colorPickerRef.current.contains(target) &&
                !colorPickerButtonRef.current.contains(target)
            ) {
                setIsColorPickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return (
        <div className='flex flex-col  h-full w-full'>
            <div className='flex'>
                <CanvasTopBar
                    toggleColorPicker={() => setIsColorPickerOpen(prev => !prev)}
                    selectedColor={selectedColor}
                    colorPickerButtonRef={colorPickerButtonRef}
                />
            </div>
            <div className='flex-1 border border-red-500 '>
                {isColorPickerOpen && (
                    <div ref={colorPickerRef} className='absolute top-20 z-50'>
                        <ColorPickerModel
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                    </div>
                )}

            </div>
        </div>
    )
}
export default page;