import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {

    ws.on("error", console.error);

    console.log("New client connected");

    ws.on("message", (message: string) => {
        console.log(`Received message: ${message}`);
        ws.send(`Server received you message: ${message}`);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});