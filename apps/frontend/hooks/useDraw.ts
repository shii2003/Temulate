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

const useDraw = (color: string = 'black', lineWidth: number = 2) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState<Position | null>(null);

    // Store all drawing actions to recreate exactly as drawn
    const actionsRef = useRef<DrawingAction[]>([]);

    // Function to redraw everything from stored actions
    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw all actions
        actionsRef.current.forEach(action => {
            if (action.type === 'line') {
                ctx.beginPath();
                ctx.moveTo(action.startX, action.startY);
                ctx.lineTo(action.endX, action.endY);
                ctx.strokeStyle = action.color;
                ctx.lineWidth = action.width;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.closePath();
            }
        });
    };

    // Function to clear the canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Clear the stored actions
        actionsRef.current = [];
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

        // Draw the line
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.stroke();
        context.closePath();

        // Store this action
        actionsRef.current.push({
            type: 'line',
            startX: lastPosition.x,
            startY: lastPosition.y,
            endX: currentPosition.x,
            endY: currentPosition.y,
            color,
            width: lineWidth
        });

        setLastPosition(currentPosition);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPosition(null);
    };

    // Set up canvas size on mount and resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasSize = () => {
            if (!canvas) return;

            const container = canvas.parentElement;
            if (!container) return;

            // Set the canvas dimensions to match the container
            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;

            // Only resize if dimensions actually changed
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;

                // Redraw all content if there are any actions
                if (actionsRef.current.length > 0) {
                    redrawCanvas();
                }
            }
        };

        // Set initial size
        setCanvasSize();

        // Debounce the resize event
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

    // Set up event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        };
    }, [isDrawing, lastPosition, color, lineWidth]);

    return { canvasRef, clearCanvas };
};

export default useDraw;