import useDraw from '@/hooks/useDraw';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiDownload, FiSave } from 'react-icons/fi';
import { GrPowerReset } from "react-icons/gr";
import { useWebSocket } from '@/hooks/useWebSocket';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type DrawingCanvasProps = {
    roomId: number,
}

interface RemoteDrawingAction {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
    userId: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ roomId }) => {
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const storageKey = `drawing-canvas-data-room-${roomId}`;

    const CANVAS_ASPECT_RATIO = 16 / 9;

    const { user } = useSelector((state: RootState) => state.auth);
    const {
        sendDrawStart,
        sendDrawMove,
        sendDrawEnd,
        onDrawStart,
        onDrawMove,
        onDrawEnd,
        offDrawStart,
        offDrawMove,
        offDrawEnd
    } = useWebSocket();

    const remoteDrawings = useRef<Record<number, {
        color: string;
        width: number;
        lastX: number;
        lastY: number;
    }>>({});

    // Store remote drawing actions for redrawing on resize
    const remoteDrawingActions = useRef<RemoteDrawingAction[]>([]);

    const {
        canvasRef,
        clearCanvas,
        saveDrawing,
        redrawCanvas,
        addDrawingAction,
        originalDimensions
    } = useDraw(color, lineWidth, storageKey);

    // Custom redraw function that includes remote drawings
    const redrawWithRemoteActions = useCallback(() => {
        // First redraw local drawings
        redrawCanvas();

        // Then redraw remote drawing actions
        const canvas = canvasRef.current;
        if (!canvas || remoteDrawingActions.current.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        console.log('Redrawing', remoteDrawingActions.current.length, 'remote actions');

        remoteDrawingActions.current.forEach(action => {
            if (action.type === 'line') {
                // Convert normalized coordinates to current canvas coordinates
                const startX = action.startX * canvas.width;
                const startY = action.startY * canvas.height;
                const endX = action.endX * canvas.width;
                const endY = action.endY * canvas.height;

                // Scale line width proportionally
                const baseSize = Math.min(canvas.width, canvas.height);
                const scaleFactor = baseSize / 500;
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
    }, [redrawCanvas, canvasRef]);

    // Override the original redrawCanvas with our custom function
    useEffect(() => {
        // Listen for canvas resize events and redraw everything
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver(() => {
            console.log('Canvas resized, redrawing all content...');
            setTimeout(() => {
                redrawWithRemoteActions();
            }, 10);
        });

        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.disconnect();
        };
    }, [redrawWithRemoteActions]);

    useEffect(() => {
        const handleRemoteDrawStart = (data: {
            userId: number,
            x: number,
            y: number,
            color: string,
            width: number
        }) => {
            if (!canvasRef.current || data.userId === user?.id) return;

            // Convert normalized coordinates (0-1) to current canvas coordinates
            const currentX = data.x * canvasRef.current.width;
            const currentY = data.y * canvasRef.current.height;

            // Calculate appropriate line width for current canvas size
            const baseSize = Math.min(canvasRef.current.width, canvasRef.current.height);
            const scaleFactor = baseSize / 500;
            const scaledWidth = data.width * Math.max(0.5, scaleFactor);

            remoteDrawings.current[data.userId] = {
                color: data.color,
                width: scaledWidth,
                lastX: currentX,
                lastY: currentY
            };
        };

        const handleRemoteDrawMove = (data: { userId: number, x: number, y: number }) => {
            const canvas = canvasRef.current;
            if (!canvas || data.userId === user?.id) return;

            const userDrawing = remoteDrawings.current[data.userId];
            if (!userDrawing) return;

            // Convert normalized coordinates to current canvas coordinates
            const currentX = data.x * canvas.width;
            const currentY = data.y * canvas.height;

            // Draw the line segment
            drawRemoteLine(
                userDrawing.lastX,
                userDrawing.lastY,
                currentX,
                currentY,
                userDrawing.color,
                userDrawing.width
            );

            // Store this action for redrawing on resize
            const normalizedAction: RemoteDrawingAction = {
                type: 'line',
                startX: userDrawing.lastX / canvas.width,
                startY: userDrawing.lastY / canvas.height,
                endX: currentX / canvas.width,
                endY: currentY / canvas.height,
                color: userDrawing.color,
                width: userDrawing.width / Math.max(0.5, Math.min(canvas.width, canvas.height) / 500), // Store original width
                userId: data.userId
            };

            remoteDrawingActions.current.push(normalizedAction);

            // Update last position
            userDrawing.lastX = currentX;
            userDrawing.lastY = currentY;
        };

        const handleRemoteDrawEnd = (data: { userId: number }) => {
            if (data.userId === user?.id) return;
            delete remoteDrawings.current[data.userId];
        };

        onDrawStart(handleRemoteDrawStart);
        onDrawMove(handleRemoteDrawMove);
        onDrawEnd(handleRemoteDrawEnd);

        return () => {
            offDrawStart(handleRemoteDrawStart);
            offDrawMove(handleRemoteDrawMove);
            offDrawEnd(handleRemoteDrawEnd);
        };
    }, [onDrawStart, onDrawMove, onDrawEnd, offDrawStart, offDrawMove, offDrawEnd, user?.id]);

    const drawRemoteLine = (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: string,
        width: number
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
            clearCanvas();
            remoteDrawingActions.current = []; // Also clear remote actions
        }
    };

    const handleSave = () => {
        saveDrawing();
        alert("Drawing saved successfully!");
    };

    const handleExport = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const link = document.createElement('a');
            link.download = `drawing-room-${roomId}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting canvas:', error);
            alert('Failed to export drawing. Please try again.');
        }
    };

    // Drawing handlers with WebSocket integration
    const startDrawing = useCallback((event: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        // Normalize coordinates to 0-1 range based on current canvas size
        const normalizedX = position.x / canvas.width;
        const normalizedY = position.y / canvas.height;

        // Send normalized coordinates to other users
        sendDrawStart(normalizedX, normalizedY, color, lineWidth);
    }, [color, lineWidth, sendDrawStart]);

    const draw = useCallback((event: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        // Normalize coordinates to 0-1 range based on current canvas size
        const normalizedX = position.x / canvas.width;
        const normalizedY = position.y / canvas.height;

        // Send normalized coordinates to other users
        sendDrawMove(normalizedX, normalizedY);
    }, [sendDrawMove]);

    const stopDrawing = useCallback(() => {
        sendDrawEnd();
    }, [sendDrawEnd]);

    // Touch event handlers for mobile support
    const handleTouchStart = useCallback((event: React.TouchEvent) => {
        event.preventDefault();
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const position = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };

            const normalizedX = position.x / canvas.width;
            const normalizedY = position.y / canvas.height;

            sendDrawStart(normalizedX, normalizedY, color, lineWidth);
        }
    }, [color, lineWidth, sendDrawStart]);

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        event.preventDefault();
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const position = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };

            const normalizedX = position.x / canvas.width;
            const normalizedY = position.y / canvas.height;

            sendDrawMove(normalizedX, normalizedY);
        }
    }, [sendDrawMove]);

    const handleTouchEnd = useCallback((event: React.TouchEvent) => {
        event.preventDefault();
        sendDrawEnd();
    }, [sendDrawEnd]);

    // Responsive container style with fixed aspect ratio
    const containerStyle = {
        aspectRatio: CANVAS_ASPECT_RATIO.toString(),
        width: '100%',
        height: 'auto',
        maxHeight: '100%'
    };

    return (
        <div className="flex flex-col items-center h-full bg-neutral-900">
            {/* Tools area */}
            <div className="flex gap-3 text-neutral-400 h-[4rem] w-full items-center justify-between px-4 py-2">
                <label className="flex items-center gap-2">
                    <span className="text-neutral-400">Color:</span>
                    <div
                        className="w-10 h-10 rounded-full border border-neutral-800 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => document.getElementById('colorPicker')?.click()}
                    />

                    <input
                        id="colorPicker"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="hidden"
                    />
                </label>

                <label className="flex items-center gap-2">
                    <span className="text-neutral-400">Size:</span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                        className="w-24"
                    />
                </label>

                <div className='flex items-center justify-center gap-2'>
                    <button
                        className='flex text-white tracking-wider items-center justify-center px-2 py-1 border border-indigo-400 rounded-md bg-indigo-400 bg-opacity-55 gap-2 hover:bg-opacity-70 transition-colors'
                        onClick={handleReset}
                        title="Clear canvas"
                    >
                        reset
                        <GrPowerReset className='opacity-75 text-white' />
                    </button>

                    <button
                        className='flex text-white tracking-wider items-center justify-center px-2 py-1 border border-neutral-700 rounded-md bg-neutral-800 gap-2 transition-colors bg-opacity-50 hover:bg-opacity-90'
                        onClick={handleSave}
                        title="Save drawing"
                    >
                        save
                        <FiSave className='opacity-75 text-white' />
                    </button>

                    <button
                        className='flex text-white tracking-wider items-center justify-center px-2 py-1 border border-neutral-700 rounded-md bg-neutral-800 gap-2 transition-colors bg-opacity-50 hover:bg-opacity-90'
                        onClick={handleExport}
                        title="Download as PNG"
                    >
                        export
                        <FiDownload className='opacity-75 text-white' />
                    </button>
                </div>
            </div>

            {/* Responsive canvas container with fixed aspect ratio */}
            <div className='flex justify-center items-center flex-1 w-full p-4'>
                <div
                    className="border border-neutral-700 rounded-md bg-neutral-800 max-w-full max-h-full"
                    style={containerStyle}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full touch-none block"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                </div>
            </div>
        </div>
    )
}

export default DrawingCanvas;