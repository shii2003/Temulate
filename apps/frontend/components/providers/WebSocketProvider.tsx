// import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/router';

// interface WebSocketMessage {
//     type: string;
//     payload: any;
// }

// interface WebSocketContextType {
//     ws: WebSocket | null;
//     isConnected: boolean;
//     currentRoom: { id: number; name: string } | null;
//     sendMessage: (message: WebSocketMessage) => void;
//     createRoom: (name: string) => void;
//     joinRoom: (roomName: string) => void;
//     leaveRoom: () => void;
// }

// const WebSocketContext = createContext<WebSocketContextType | null>(null);

// export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [ws, setWs] = useState<WebSocket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [currentRoom, setCurrentRoom] = useState<{ id: number; name: string } | null>(null);
//     const router = useRouter();
//     const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
//     const reconnectAttemptsRef = useRef(0);
//     const maxReconnectAttempts = 5;

//     const connect = () => {
//         try {
//             const websocket = new WebSocket('ws://localhost:8080');

//             websocket.onopen = () => {
//                 console.log('WebSocket connected');
//                 setIsConnected(true);
//                 reconnectAttemptsRef.current = 0;
//             };

//             websocket.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 handleMessage(data);
//             };

//             websocket.onclose = (event) => {
//                 console.log('WebSocket disconnected:', event.code, event.reason);
//                 setIsConnected(false);

//                 if (event.code !== 4001 && event.code !== 1008) {
//                     attemptReconnect();
//                 }
//             };

//             websocket.onerror = (error) => {
//                 console.error('WebSocket error:', error);
//             };

//             setWs(websocket);
//         } catch (error) {
//             console.error('Failed to connect WebSocket:', error);
//             attemptReconnect();
//         }
//     };

//     const attemptReconnect = () => {
//         if (reconnectAttemptsRef.current < maxReconnectAttempts) {
//             reconnectAttemptsRef.current++;
//             const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff

//             console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);

//             reconnectTimeoutRef.current = setTimeout(() => {
//                 connect();
//             }, delay);
//         }
//     };

//     const handleMessage = (data: WebSocketMessage) => {
//         switch (data.type) {
//             case 'room-created':
//             case 'room-joined':
//                 setCurrentRoom({
//                     id: data.payload.roomId,
//                     name: data.payload.roomName
//                 });
                
//                 router.push(`/codeRooms/${data.payload.roomId}`);
//                 break;

//             case 'room-left':
//                 setCurrentRoom(null);
//                 router.push('/'); 
//                 break;

//             case 'error':
//                 console.error('WebSocket error:', data.payload.message);
//                 break;

//             default:
//                 console.log('Received message:', data);
//         }
//     };

//     const sendMessage = (message: WebSocketMessage) => {
//         if (ws && isConnected) {
//             ws.send(JSON.stringify(message));
//         } else {
//             console.error('WebSocket not connected');
//         }
//     };

//     const createRoom = (name: string) => {
//         sendMessage({
//             type: 'create-room',
//             payload: { name }
//         });
//     };

//     const joinRoom = (roomName: string) => {
//         sendMessage({
//             type: 'join-room',
//             payload: { roomName }
//         });
//     };

//     const leaveRoom = () => {
//         sendMessage({
//             type: 'leave-room',
//             payload: {}
//         });
//     };

//     useEffect(() => {
//         connect();

//         return () => {
//             if (reconnectTimeoutRef.current) {
//                 clearTimeout(reconnectTimeoutRef.current);
//             }
//             if (ws) {
//                 ws.close();
//             }
//         };
//     }, []);

//     // Cleanup on unmount
//     useEffect(() => {
//         const handleBeforeUnload = () => {
//             if (ws) {
//                 ws.close();
//             }
//         };

//         window.addEventListener('beforeunload', handleBeforeUnload);
//         return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//     }, [ws]);

//     return (
//         <WebSocketContext.Provider value={{
//             ws,
//             isConnected,
//             currentRoom,
//             sendMessage,
//             createRoom,
//             joinRoom,
//             leaveRoom
//         }}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };

// export const useWebSocket = () => {
//     const context = useContext(WebSocketContext);
//     if (!context) {
//         throw new Error('useWebSocket must be used within a WebSocketProvider');
//     }
//     return context;
// };
