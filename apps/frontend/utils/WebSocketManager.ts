import { toast } from "sonner";

class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;

    private constructor() { };

    connect(url: string) {
        if (this.socket) {
            return;
        }
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection has been established.');
        }

        this.socket.onerror = (err) => {
            console.log('WebSocket error:', err);
        }

        this.socket.onclose = () => {
            this.socket = null;
            console.log("WebSocket connection closed.");
        };
    }

    static getInstance(): WebSocketManager {
        if (!this.instance) {
            this.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    //TODO: add types here probabaly the outgoing types.
    send(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            toast.error("Webocket not connected.");
        }
    }

    onMessage(callback: (data: any) => void) {
        if (!this.socket) return;
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            callback(message);
        };
    }

    close() {
        this.socket?.close();
        this.socket = null;
    }
}

const webSocketManager = WebSocketManager.getInstance();
export default webSocketManager;