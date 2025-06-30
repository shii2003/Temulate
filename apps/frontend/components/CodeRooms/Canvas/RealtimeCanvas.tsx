'use client';
import CanvasTopBar from '@/components/CodeRooms/Canvas/CanvasTopBar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResetOptionModal from '@/components/ui/modals/ResetOptionModal';
import ExportImageModal from '@/components/ui/modals/ExportImageModal';
import EraserSizeSelectorModal from '@/components/ui/modals/EraserSizeSelectorModal';
import SaveOptionModal from '@/components/ui/modals/SaveOptionModal';
import SizeSelectorModal from '@/components/ui/modals/SizeSelectorModal';
import ColorPickerModal from '@/components/ui/modals/ColorPickerModal';
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRealtimeDrawing } from "@/hooks/useRealtimeDrawing";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


type pageProps = { roomId: number };

type Stroke = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
    isEraser?: boolean;
};

const REFERENCE_CANVAS_SIZE = 1000;

const page: React.FC<pageProps> = ({ roomId }) => {

    const { user } = useSelector((state: RootState) => state.auth);
    const {
        sendDrawStart,
        sendDrawMove,
        sendDrawEnd,
    } = useWebSocket();

    const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

    const [brushSize, setBrushSize] = useState<number>(10);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState<boolean>(false);

    const [isEraserMode, setIsEraserMode] = useState<boolean>(false);
    const [isEraserSizeSelectorOpen, setIsEraserSizeSelectorOpen] = useState<boolean>(false);
    const [eraserSize, setEraserSize] = useState<number>(14);

    const [isResetOptionOpen, setIsResetOptionOpen] = useState<boolean>(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const colorPickerButtonRef = useRef<HTMLButtonElement>(null);

    const brushSizeRef = useRef<HTMLDivElement>(null);
    const brushSizeButtonRef = useRef<HTMLButtonElement>(null);

    const eraserSizeSelectorRef = useRef<HTMLDivElement>(null);
    const eraserToggleButtonRef = useRef<HTMLButtonElement>(null);
    const eraserSizeButtonRef = useRef<HTMLButtonElement>(null);

    const backgroundColorHexCode = '#171717';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
    const strokes = useRef<Stroke[]>([]);

    const getProportionalSize = (absoluteSize: number, canvasWidth: number, canvasHeight: number): number => {
        const base = Math.min(canvasWidth, canvasHeight);
        return (absoluteSize / base) * REFERENCE_CANVAS_SIZE;
    };

    const getAbsoluteSize = (proportionalSize: number, canvasWidth: number, canvasHeight: number): number => {
        const base = Math.min(canvasWidth, canvasHeight);
        return (proportionalSize / REFERENCE_CANVAS_SIZE) * base;
    };

    const createEraserCursor = (size: number) => {
        const adjustedSize = Math.max(16, Math.min(size, 64));
        const svg = `
            <svg width="${adjustedSize}" height="${adjustedSize}" viewBox="0 0 ${adjustedSize} ${adjustedSize}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${adjustedSize / 2}" cy="${adjustedSize / 2}" r="${adjustedSize / 2 - 2}" 
                        fill="none" stroke="#ef4444" stroke-width="2" opacity="0.8"/>
                <circle cx="${adjustedSize / 2}" cy="${adjustedSize / 2}" r="2" fill="#ef4444" opacity="0.6"/>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (isEraserMode) {
            const currentWidth = getAbsoluteSize(eraserSize, canvas.width, canvas.height);
            const cursorUrl = createEraserCursor(currentWidth);
            const centerOffset = Math.max(8, Math.min(currentWidth / 2, 32));
            canvas.style.cursor = `url('${cursorUrl}') ${centerOffset} ${centerOffset}, crosshair`;
        } else {
            canvas.style.cursor = 'crosshair';
        }
    }, [isEraserMode, eraserSize]);

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

    const getCanvasPosition = (e: MouseEvent | TouchEvent) => {
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
            x: clientX - rect.left,
            y: clientY - rect.top,
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

        const absoluteWidth = getAbsoluteSize(stroke.width, canvasWidth, canvasHeight);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = absoluteWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };

    const drawImmediate = (
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        color: string,
        proportionalWidth: number
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const absoluteWidth = getAbsoluteSize(proportionalWidth, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = absoluteWidth;
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

    const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
        setIsDrawing(true);
        const position = getCanvasPosition(e);
        setLastPosition(position);

        const normalized = getNormalizedMousePos(e);
        const currentColor = isEraserMode ? backgroundColorHexCode : selectedColor;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const proportionalWidth = getProportionalSize(
            isEraserMode ? eraserSize : brushSize,
            canvas.width,
            canvas.height
        );

        sendDrawStart(normalized.x, normalized.y, currentColor, proportionalWidth, isEraserMode);
    }, [selectedColor, brushSize, isEraserMode, eraserSize]);

    const draw = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDrawing || !lastPosition) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const currentPosition = getCanvasPosition(e);
        const currentColor = isEraserMode ? backgroundColorHexCode : selectedColor;

        const proportionalWidth = getProportionalSize(
            isEraserMode ? eraserSize : brushSize,
            canvas.width,
            canvas.height
        );

        drawImmediate(
            lastPosition.x,
            lastPosition.y,
            currentPosition.x,
            currentPosition.y,
            currentColor,
            proportionalWidth
        );

        const normalized = getNormalizedMousePos(e);

        sendDrawMove(normalized.x, normalized.y, currentColor, proportionalWidth, isEraserMode);

        const normalizedStart = getNormalizedMousePos({
            clientX: lastPosition.x + canvas.getBoundingClientRect().left,
            clientY: lastPosition.y + canvas.getBoundingClientRect().top,
        } as any);

        const normalizedEnd = normalized;

        const stroke: Stroke = {
            startX: normalizedStart.x,
            startY: normalizedStart.y,
            endX: normalizedEnd.x,
            endY: normalizedEnd.y,
            color: currentColor,
            width: proportionalWidth,
            isEraser: isEraserMode,
        };

        strokes.current.push(stroke);
        setLastPosition(currentPosition);
    }, [isDrawing, lastPosition, selectedColor, brushSize, isEraserMode, eraserSize]);

    const stopDrawing = useCallback(() => {
        if (isDrawing) {
            sendDrawEnd();
        }
        setIsDrawing(false);
        setLastPosition(null);
    }, [isDrawing]);


    useRealtimeDrawing({
        drawRemoteLine: (startX, startY, endX, endY, color, proportionalWidth) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const actualStartX = startX * canvas.width;
            const actualStartY = startY * canvas.height;
            const actualEndX = endX * canvas.width;
            const actualEndY = endY * canvas.height;

            const absoluteWidth = getAbsoluteSize(proportionalWidth, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(actualStartX, actualStartY);
            ctx.lineTo(actualEndX, actualEndY);
            ctx.strokeStyle = color;
            ctx.lineWidth = absoluteWidth;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.closePath();
        },
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) { return; }
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
    }, [startDrawing, draw, stopDrawing]);

    useEffect(() => {
        const handleClickOutsideColorPicker = (event: MouseEvent) => {
            const target = event.target as Node;
            if (colorPickerRef.current &&
                !colorPickerRef.current.contains(target) &&
                colorPickerButtonRef.current &&
                !colorPickerButtonRef.current.contains(target)
            ) {
                setIsColorPickerOpen(false);
            }
        }

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
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideEraserSizeSelector = (event: MouseEvent) => {
            const target = event?.target as Node;

            if (eraserSizeSelectorRef.current &&
                !eraserSizeSelectorRef.current.contains(target) &&
                eraserSizeButtonRef.current &&
                !eraserSizeButtonRef.current.contains(target)
            ) {
                setIsEraserSizeSelectorOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideEraserSizeSelector);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideEraserSizeSelector);
        }
    }, [])


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
                    eraserSize={eraserSize}
                    eraserSizeButtonRef={eraserSizeButtonRef}
                    isEraserMode={isEraserMode}
                    toggleEraserMode={() => setIsEraserMode(prev => !prev)}
                    eraserToggleButtonRef={eraserToggleButtonRef}
                    toggleEraserSizeSelector={() => setIsEraserSizeSelectorOpen(prev => !prev)}
                    setIsResetOptionOpen={setIsResetOptionOpen}
                    setIsSaveModalOpen={setIsSaveModalOpen}
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
                        <ColorPickerModal
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                    </div>
                )}
                <div ref={brushSizeRef} className='absolute top-15 z-50'>
                    {isSizeSelectorOpen && (
                        <SizeSelectorModal
                            setBrushSize={setBrushSize}
                        />
                    )}
                </div>

                {isEraserSizeSelectorOpen && (
                    <div ref={eraserSizeSelectorRef} className='absolute z-50 ml-24'>
                        <EraserSizeSelectorModal
                            setEraserSize={setEraserSize}
                        />
                    </div>
                )

                }
                {isResetOptionOpen && (
                    <ResetOptionModal
                        setIsResetOptionOpen={setIsResetOptionOpen}
                        handleResetCanvas={handleResetCanvas}
                    />
                )}
                {isSaveModalOpen &&
                    <SaveOptionModal
                        setIsSaveModalOpen={setIsSaveModalOpen}
                    />
                }
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

