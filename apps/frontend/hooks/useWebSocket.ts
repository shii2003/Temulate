import { setRoom } from "@/store/features/room/roomSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useWebSocket = (url: string) => {

    const [ws, setWs] = useState<WebSocket | null>(null);
    const webSocketRef = useRef<WebSocket | null>(null);


    useEffect(() => {

        const socket = new WebSocket(url);
        webSocketRef.current = socket;
        setWs(socket);

        return () => {
            if (webSocketRef.current?.readyState === WebSocket.OPEN) {
                webSocketRef.current.close();
            }
        };

    }, [url]);

    return ws;
};