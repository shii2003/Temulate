import { useRef, useEffect, useState, useCallback } from 'react';

interface Position {
    x: number;
    y: number;
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
    const originalDimensions = useRef({ width: 0, height: 0 });
    const canvasDimensionsRef = useRef({ width: 0, height: 0 });
    const isInitialized = useRef(false);

    // Normalize coordinates to 0-1 range based on current canvas dimensions
    const normalizeCoordinates = (x: number, y: number): Position => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            return { x: 0, y: 0 };
        }
        return {
            x: x / canvas.width,
            y: y / canvas.height
        };
    };

    // Convert normalized coordinates back to current canvas coordinates
    const denormalizeCoordinates = (normalizedX: number, normalizedY: number): Position => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        return {
            x: normalizedX * canvas.width,
            y: normalizedY * canvas.height
        };
    };

    const saveDrawing = useCallback(() => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dataToSave = {
                actions: normalizedActionsRef.current,
                originalDimensions: {
                    width: canvas.width,
                    height: canvas.height
                }
            };

            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            console.log('Drawing saved to localStorage');
        } catch (error) {
            console.error('Error saving drawing to localStorage:', error);
        }
    }, [storageKey]);

    const loadDrawing = useCallback(() => {
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const parsed = JSON.parse(savedData);

                // Handle both old and new data formats
                if (Array.isArray(parsed)) {
                    // Old format - just actions
                    normalizedActionsRef.current = parsed;
                } else if (parsed.actions) {
                    // New format - actions with original dimensions
                    normalizedActionsRef.current = parsed.actions;
                    if (parsed.originalDimensions) {
                        originalDimensions.current = parsed.originalDimensions;
                    }
                }

                console.log('Drawing loaded from localStorage', normalizedActionsRef.current.length, 'actions');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading drawing from localStorage:', error);
            return false;
        }
    }, [storageKey]);

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // If no actions to redraw, return early
        if (normalizedActionsRef.current.length === 0) {
            return;
        }

        console.log('Redrawing canvas with', normalizedActionsRef.current.length, 'actions');

        // Redraw all normalized actions
        normalizedActionsRef.current.forEach(action => {
            if (action.type === 'line') {
                // Convert normalized coordinates (0-1) to current canvas coordinates
                const startX = action.startX * canvas.width;
                const startY = action.startY * canvas.height;
                const endX = action.endX * canvas.width;
                const endY = action.endY * canvas.height;

                // Scale line width proportionally to canvas size
                // Use a base reference size to maintain consistent line width scaling
                const baseSize = Math.min(canvas.width, canvas.height);
                const scaleFactor = baseSize / 500; // 500 is arbitrary base size
                const scaledWidth = action.width * Math.max(0.5, scaleFactor);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = action.color;
                ctx.lineWidth = scaledWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.closePath();
            }
        });
    }, []);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        normalizedActionsRef.current = [];

        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error removing drawing from localStorage:', error);
        }
    }, [storageKey]);

    // Add drawing action to the normalized actions array
    const addDrawingAction = useCallback((action: NormalizedDrawingAction) => {
        normalizedActionsRef.current.push(action);
        saveDrawing();
    }, [saveDrawing]);

    const startDrawing = useCallback((event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        setIsDrawing(true);
        setLastPosition(position);
    }, []);

    const draw = useCallback((event: MouseEvent) => {
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

        // Draw on canvas immediately
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.stroke();
        context.closePath();

        // Store normalized coordinates for later redrawing
        const normalizedStart = normalizeCoordinates(lastPosition.x, lastPosition.y);
        const normalizedEnd = normalizeCoordinates(currentPosition.x, currentPosition.y);

        const action: NormalizedDrawingAction = {
            type: 'line',
            startX: normalizedStart.x,
            startY: normalizedStart.y,
            endX: normalizedEnd.x,
            endY: normalizedEnd.y,
            color,
            width: lineWidth
        };

        addDrawingAction(action);
        setLastPosition(currentPosition);
    }, [isDrawing, lastPosition, color, lineWidth, normalizeCoordinates, addDrawingAction]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
        setLastPosition(null);
    }, []);

    // Canvas setup and resize handling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasSize = () => {
            const container = canvas.parentElement;
            if (!container) return;

            const dpr = window.devicePixelRatio || 1;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Define a fixed aspect ratio (16:9 is common for drawing canvases)
            const ASPECT_RATIO = 16 / 9;

            // Calculate dimensions that fit within container while maintaining aspect ratio
            let displayWidth, displayHeight;

            const containerAspectRatio = containerWidth / containerHeight;

            if (containerAspectRatio > ASPECT_RATIO) {
                // Container is wider than our aspect ratio, constrain by height
                displayHeight = containerHeight;
                displayWidth = displayHeight * ASPECT_RATIO;
            } else {
                // Container is taller than our aspect ratio, constrain by width
                displayWidth = containerWidth;
                displayHeight = displayWidth / ASPECT_RATIO;
            }

            // Store original dimensions only once when first setting up
            if (!isInitialized.current) {
                originalDimensions.current = {
                    width: displayWidth,
                    height: displayHeight
                };
                isInitialized.current = true;
                console.log('Set original dimensions:', originalDimensions.current);
            }

            const canvasWidth = displayWidth * dpr;
            const canvasHeight = displayHeight * dpr;

            // Only update if dimensions actually changed to avoid unnecessary redraws
            if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

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

                console.log('Canvas resized to:', displayWidth, 'x', displayHeight);

                // Redraw all stored actions with new dimensions
                redrawCanvas();
            }
        };

        // Load saved drawing first, then set canvas size
        const hasData = loadDrawing();
        setCanvasSize();

        // If we had saved data but canvas wasn't ready before, redraw now
        if (hasData && normalizedActionsRef.current.length > 0) {
            // Small delay to ensure canvas is properly initialized
            setTimeout(() => {
                redrawCanvas();
            }, 10);
        }

        const handleResize = () => {
            console.log('Window resized, updating canvas...');
            setCanvasSize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [loadDrawing, redrawCanvas]);

    // Event listeners
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
    }, [startDrawing, draw, stopDrawing]);

    return {
        canvasRef,
        clearCanvas,
        saveDrawing,
        loadDrawing,
        redrawCanvas,
        addDrawingAction,
        originalDimensions
    };
};

export default useDraw;