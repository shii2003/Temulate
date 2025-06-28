// hooks/useRealtimeDrawing.ts
import { useEffect } from "react";
import { useWebSocket } from "./useWebSocket";

type StrokeReceiverProps = {
    drawRemoteLine: (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: string,
        width: number
    ) => void;
};

export const useRealtimeDrawing = ({ drawRemoteLine }: StrokeReceiverProps) => {
    const {
        onDrawStart,
        onDrawMove,
        onDrawEnd,
        offDrawStart,
        offDrawMove,
        offDrawEnd,
    } = useWebSocket();

    const userPositions = new Map<number, { x: number; y: number; color: string; width: number }>();

    useEffect(() => {
        const handleStart = ({
            userId,
            x,
            y,
            color,
            width,
            isEraser,
        }: {
            userId: number;
            x: number;
            y: number;
            color: string;
            width: number;
            isEraser: boolean;
        }) => {
            userPositions.set(userId, { x, y, color, width });
        };

        const handleMove = ({
            userId,
            x,
            y,
            color,
            width,
            isEraser,
        }: {
            userId: number;
            x: number;
            y: number;
            color: string;
            width: number;
            isEraser: boolean;
        }) => {
            const lastPos = userPositions.get(userId);
            if (!lastPos) return;

            // Use the actual color and width from the received data
            drawRemoteLine(lastPos.x, lastPos.y, x, y, color, width);
            userPositions.set(userId, { x, y, color, width });
        };

        const handleEnd = ({ userId }: { userId: number }) => {
            userPositions.delete(userId);
        };

        onDrawStart(handleStart);
        onDrawMove(handleMove);
        onDrawEnd(handleEnd);

        return () => {
            offDrawStart(handleStart);
            offDrawMove(handleMove);
            offDrawEnd(handleEnd);
        };
    }, [onDrawStart, onDrawMove, onDrawEnd, offDrawStart, offDrawMove, offDrawEnd, drawRemoteLine]);
};
