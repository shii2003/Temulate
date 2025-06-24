'use client';
import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import ColorPickerModel from '@/components/ui/modals/ColorPickerModal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SizeSelectorModel from '@/components/ui/modals/SizeSelectorModel';
import ResetOptionModal from '@/components/ui/modals/ResetOptionModal';
import ExportImageModal from '@/components/ui/modals/ExportImageModal';
import { toast } from 'sonner';

type pageProps = {};

type Stroke = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
    isEraser?: boolean;
};

const page: React.FC<pageProps> = () => {
    const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const [brushSize, setBrushSize] = useState<number>(10);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState<boolean>(false);

    const [isEraserOpen, setIsEraserOpen] = useState<boolean>(false);

    const [isResetOptionOpen, setIsResetOptionOpen] = useState<boolean>(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const colorPickerButtonRef = useRef<HTMLButtonElement>(null);

    const brushSizeRef = useRef<HTMLDivElement>(null);
    const brushSizeButtonRef = useRef<HTMLButtonElement>(null);

    const backgroundColorHexCode = '#171717';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const strokes = useRef<Stroke[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            redraw();
        };

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);

        resizeCanvas();

        return () => {
            observer.disconnect();
        };
    }, []);

    const getNormalizedMousePos = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = (e as TouchEvent).touches
            ? (e as TouchEvent).touches[0].clientX
            : (e as MouseEvent).clientX;
        const clientY = (e as TouchEvent).touches
            ? (e as TouchEvent).touches[0].clientY
            : (e as MouseEvent).clientY;

        return {
            x: (clientX - rect.left) / rect.width,
            y: (clientY - rect.top) / rect.height,
        };
    };

    const drawLine = (
        ctx: CanvasRenderingContext2D,
        stroke: Stroke,
        canvasWidth: number,
        canvasHeight: number
    ) => {
        const startX = stroke.startX * canvasWidth;
        const startY = stroke.startY * canvasHeight;
        const endX = stroke.endX * canvasWidth;
        const endY = stroke.endY * canvasHeight;

        const base = Math.min(canvasWidth, canvasHeight);
        const scaledWidth = stroke.width * Math.max(0.5, base / 500);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = stroke.isEraser ? '#171717' : stroke.color;
        ctx.lineWidth = scaledWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };


    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const stroke of strokes.current) {
            drawLine(ctx, stroke, canvas.width, canvas.height);
        }
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            isDrawing.current = true;
            lastPos.current = getNormalizedMousePos(e);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing.current || !lastPos.current) return;
            const pos = getNormalizedMousePos(e);

            const stroke: Stroke = {
                startX: lastPos.current.x,
                startY: lastPos.current.y,
                endX: pos.x,
                endY: pos.y,
                color: selectedColor,
                width: brushSize,
                isEraser: isEraserOpen
            };

            strokes.current.push(stroke);
            drawLine(ctx, stroke, canvas.width, canvas.height);
            lastPos.current = pos;
        };

        const stopDrawing = () => {
            isDrawing.current = false;
            lastPos.current = null;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        window.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stopDrawing);

            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            window.removeEventListener('touchend', stopDrawing);
        };
    }, [selectedColor, brushSize, isEraserOpen]);

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
        };
    }, []);

    const handleResetCanvas = () => {
        strokes.current = []
        redraw();
    }

    return (
        <div className='flex flex-col h-full w-full'>
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
                    setIsResetOptionOpen={setIsResetOptionOpen}
                    setIsExportModalOpen={setIsExportModalOpen}

                />
            </div>
            <div className='relative flex-1 px-4 py-2 bg-neutral-900 overflow-hidden'>

                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(23,23,23,0.3), rgba(23,23,23,0.2), rgba(23,23,23,0.3)), url('/cartographer.png')`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: 'auto',
                        backgroundPosition: 'center',
                        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
                    }}
                />

                {isColorPickerOpen && (
                    <div ref={colorPickerRef} className='absolute top-15 z-50'>
                        <ColorPickerModel
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                    </div>
                )}
                <div ref={brushSizeRef} className='absolute top-15 z-50'>
                    {isSizeSelectorOpen && (
                        <SizeSelectorModel
                            setBrushSize={setBrushSize}
                        />
                    )}
                </div>

                {isResetOptionOpen && (
                    <ResetOptionModal
                        setIsResetOptionOpen={setIsResetOptionOpen}
                        handleResetCanvas={handleResetCanvas}
                    />
                )}

                {isExportModalOpen &&
                    <ExportImageModal
                        setIsExportModalOpen={setIsExportModalOpen}
                        canvasRef={canvasRef}
                        backgroundColorHexCode={backgroundColorHexCode}
                    />
                }
                <div
                    className="relative w-full max-w-4xl mx-auto aspect-[4/3] border border-neutral-700 rounded-md bg-neutral-900 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default page;
