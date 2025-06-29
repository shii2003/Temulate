"use client";
import React, { useEffect, useState } from 'react';
import Lobby from './Lobby/Lobby';
import DrawingCanvas from '@/components/CodeRooms/DrawingCanvas';

interface WorkspaceProps {
    roomId: number;
}
const Workspace: React.FC<WorkspaceProps> = ({ roomId }) => {

    useEffect(() => {
        return () => {
            if (!window.location.pathname.startsWith('/codeRooms')) {

            }
        }
    }, [roomId,])
    return (

        <div className='flex w-full h-full  max-w-7xl mx-auto'>
            <div className=' w-3/5  min-w-5 '>
                <DrawingCanvas roomId={roomId} />
            </div>
            <div className='w-2/5'>
                <Lobby roomId={roomId} />
            </div>
        </div>
    )
}
export default Workspace;

// <div className='w-full h-full'>
//     <Split
//         style={{ height: '100%', borderRadius: 3 }}
//         mode="horizontal"
//         renderBar={({ onMouseDown, ...props }) => {
//             return (
//                 <div
//                     {...props}
//                     style={{ boxShadow: 'none', background: 'transparent' }}>
//                     <div
//                         onMouseDown={onMouseDown}
//                         style={{ backgroundColor: '#404040', boxShadow: "none" }}
//                     />
//                 </div>
//             );
//         }}
//     >
//         <div
//             style={{ minWidth: 80, width: '70%', height: '100%' }}
//             className='border border-yellow-400'>
//             <DrawingCanvas />
//         </div>
//         <div
//             style={{ minWidth: 80, width: '30%', height: '100%' }}
//             className='flex'
//         >
//             <Lobby />
//         </div>
//     </Split>
// </div>