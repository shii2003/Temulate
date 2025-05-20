import { useRef, useEffect, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

interface DrawingAction {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
}


interface NormalizedDrawingAction {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
}

const DEFAULT_STORAGE_KEY = 'canvas-drawing-data';

const useDraw = (color: string = 'black', lineWidth: number = 2, storageKey: string = DEFAULT_STORAGE_KEY) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState<Position | null>(null);

    const normalizedActionsRef = useRef<NormalizedDrawingAction[]>([]);

    const canvasDimensionsRef = useRef({ width: 0, height: 0 });

    const normalizeCoordinates = (x: number, y: number): Position => {
        const { width, height } = canvasDimensionsRef.current;
        if (width === 0 || height === 0) return { x: 0, y: 0 };

        return {
            x: x / width,
            y: y / height
        };
    };

    const saveDrawing = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(normalizedActionsRef.current));
            console.log('Drawing saved to localStorage');
        } catch (error) {
            console.error('Error saving drawing to localStorage:', error);
        }
    };

    const loadDrawing = () => {
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                normalizedActionsRef.current = JSON.parse(savedData);
                redrawCanvas();
                console.log('Drawing loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading drawing from localStorage:', error);
        }
    };

    const denormalizeCoordinates = (normalizedX: number, normalizedY: number): Position => {
        const { width, height } = canvasDimensionsRef.current;
        return {
            x: normalizedX * width,
            y: normalizedY * height
        };
    };

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvasDimensionsRef.current = {
            width: canvas.width,
            height: canvas.height
        };

        normalizedActionsRef.current.forEach(action => {
            if (action.type === 'line') {

                const start = denormalizeCoordinates(action.startX, action.startY);
                const end = denormalizeCoordinates(action.endX, action.endY);

                const scaledWidth = Math.max(1, action.width * Math.min(canvas.width, canvas.height) / 500);

                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = action.color;
                ctx.lineWidth = scaledWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.closePath();
            }
        });
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        normalizedActionsRef.current = [];

        localStorage.removeItem(storageKey);
    };

    const startDrawing = (event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        setIsDrawing(true);
        setLastPosition(position);
    };

    const draw = (event: MouseEvent) => {
        if (!isDrawing || !lastPosition) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();

        const currentPosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.stroke();
        context.closePath();

        const normalizedStart = normalizeCoordinates(lastPosition.x, lastPosition.y);
        const normalizedEnd = normalizeCoordinates(currentPosition.x, currentPosition.y);

        normalizedActionsRef.current.push({
            type: 'line',
            startX: normalizedStart.x,
            startY: normalizedStart.y,
            endX: normalizedEnd.x,
            endY: normalizedEnd.y,
            color,
            width: lineWidth
        });

        saveDrawing();

        setLastPosition(currentPosition);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPosition(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasSize = () => {
            if (!canvas) return;

            const container = canvas.parentElement;
            if (!container) return;

            const dpr = window.devicePixelRatio || 1;

            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
            }

            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            canvasDimensionsRef.current = {
                width: displayWidth,
                height: displayHeight
            };

            if (normalizedActionsRef.current.length > 0) {
                redrawCanvas();
            }
        };

        setCanvasSize();

        loadDrawing();

        let resizeTimeout: number | null = null;
        const handleResize = () => {
            if (resizeTimeout) {
                window.clearTimeout(resizeTimeout);
            }
            resizeTimeout = window.setTimeout(setCanvasSize, 200);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeout) {
                window.clearTimeout(resizeTimeout);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDrawing, lastPosition, color, lineWidth]);

    return {
        canvasRef,
        clearCanvas,
        saveDrawing,
        loadDrawing
    };
};

export default useDraw;