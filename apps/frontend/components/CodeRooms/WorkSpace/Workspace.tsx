"use client";
import React from 'react';
import Split from '@uiw/react-split';
import InteractiveEditor from './CodeEditor/InteractiveEditor';
import Terminal from './CodeEditor/Terminal';
import Lobby from './Lobby/Lobby';
import DrawingCanvas from '@/components/GameRoom/DrawingCanvas';

const Workspace: React.FC = () => {

    return (
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
        <div className='flex w-full h-full  max-w-7xl mx-auto'>
            <div className=' w-3/5  min-w-5 '>
                <DrawingCanvas />
            </div>
            <div className='w-2/5'>
                <Lobby />
            </div>
        </div>
    )
}
export default Workspace;