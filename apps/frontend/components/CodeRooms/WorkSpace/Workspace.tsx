"use client";
import React from 'react';
import Split from '@uiw/react-split';
import InteractiveEditor from './CodeEditor/InteractiveEditor';
import Terminal from './CodeEditor/Terminal';
import Lobby from './Lobby/Lobby';

const Workspace: React.FC = () => {

    return (
        <div className='w-full h-full'>
            <Split
                style={{ height: '100%', borderRadius: 3 }}
                mode="horizontal"
                renderBar={({ onMouseDown, ...props }) => {
                    return (
                        <div
                            {...props}
                            style={{ boxShadow: 'none', background: 'transparent' }}>
                            <div
                                onMouseDown={onMouseDown}
                                style={{ backgroundColor: '#404040', boxShadow: "none" }}
                            />
                        </div>
                    );
                }}
            >
                <Split
                    mode="vertical"
                    renderBar={({ onMouseDown, ...props }) => {
                        return (
                            <div
                                {...props}
                                style={{ boxShadow: 'none', background: 'transparent' }}
                            >
                                <div
                                    onMouseDown={onMouseDown}
                                    style={{ backgroundColor: '#404040', boxShadow: "none" }}
                                />
                            </div>
                        );
                    }}
                    style={{
                        flex: 1,
                        height: '100%',
                        minWidth: 120,
                        borderRadius: 3,
                    }}
                >
                    <div
                        style={{ height: '50%', minHeight: 120 }}
                        className=' overflow-y-auto '

                    >
                        <InteractiveEditor />
                    </div>
                    <div style={{ height: '50%', minHeight: 120 }}
                    >
                        <Terminal />
                    </div>

                </Split>
                <div
                    style={{ minWidth: 80, width: '30%', height: '100%' }}
                    className='flex'
                >
                    <Lobby />
                </div>
            </Split>
        </div>

    )
}
export default Workspace;