type MessageHandler = (data: any) => void;

export class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private handlers: Record<string, MessageHandler[]> = {};
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    private constructor() { }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public connect(url: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            this.reconnectAttempts = 0;

        };

        this.socket.onclose = (event) => {
            console.log("WebSocket closed", event);
            this.socket = null;

            // Attempt to reconnect if not a normal closure
            if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.reconnectAttempts++;
                    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    this.connect(url);
                }, this.reconnectDelay * this.reconnectAttempts);
            }


        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error", error);
        };

        this.socket.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                const { type, payload } = parsed;

                if (this.handlers[type]) {
                    this.handlers[type].forEach((handler) => handler(payload));
                } else {
                    console.warn("Unhandled WebSocket event:", type);
                }
            } catch (err) {
                console.error("Invalid WebSocket message:", event.data);
            }
        };
    }

    public send(type: string, payload: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            this.socket.send(message);
        } else {
            console.warn("WebSocket is not open. Cannot send message.");
        }
    }

    public on(event: string, handler: MessageHandler): void {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    public off(event: string, handler: MessageHandler): void {
        if (this.handlers[event]) {
            this.handlers[event] = this.handlers[event].filter((h) => h !== handler);
        }
    }

    public isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    public getConnectionState(): number | null {
        return this.socket?.readyState || null;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close(1000, 'Intentional disconnect');
            this.socket = null;
        }

        this.handlers = {};
    }
}