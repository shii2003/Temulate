'use client';
import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import ColorPickerModel from '@/components/ui/modals/ColorPickerModel';
import React, { useEffect, useRef, useState } from 'react';
import SizeSelectorModel from '@/components/ui/modals/SizeSelectorModel';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    const [selectedColor, setSelectedColor] = useState<string>("#000000");
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const [brushSize, setBrushSize] = useState<number>(10);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState<boolean>(false);

    const [isEraserOpen, setIsEraserOpen] = useState<boolean>(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const colorPickerButtonRef = useRef<HTMLButtonElement>(null);

    const brushSizeRef = useRef<HTMLDivElement>(null);
    const brushSizeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutsideColorPicker = (event: MouseEvent) => {
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

        document.addEventListener("mousedown", handleClickOutsideColorPicker);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideColorPicker);
        }
    }, [])

    useEffect(() => {
        const handleClickOutsideSizeSelector = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                brushSizeRef.current &&
                brushSizeButtonRef.current &&
                !brushSizeRef.current.contains(target) &&
                !brushSizeButtonRef.current.contains(target)
            ) {
                setIsSizeSelectorOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideSizeSelector);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideSizeSelector);
        }
    }, [])

    return (
        <div className='flex flex-col  h-full w-full'>
            <div className='flex'>
                <CanvasTopBar
                    selectedColor={selectedColor}
                    colorPickerButtonRef={colorPickerButtonRef}
                    toggleColorPicker={() => setIsColorPickerOpen(prev => !prev)}

                    brushSize={brushSize}
                    brushSizeButtonRef={brushSizeButtonRef}
                    toggleSizeSelector={() => setIsSizeSelectorOpen(prev => !prev)}

                    isEraserOpen={isEraserOpen}
                    toggleIsEraserOpen={() => setIsEraserOpen(prev => !prev)}
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
                <div ref={brushSizeRef} className='absolute top-20 z-50'>
                    {isSizeSelectorOpen && (
                        <SizeSelectorModel
                            setBrushSize={setBrushSize}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
export default page;