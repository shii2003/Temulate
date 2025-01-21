"use client";
import React from 'react';
import Split from '@uiw/react-split';
import InteractiveEditor from './CodeEditor/InteractiveEditor';
import Terminal from './CodeEditor/Terminal';
import Lobby from './Lobby/Lobby';




const Workspace: React.FC = () => {

    return (
        <div className='w-full h-screen '>
            <Split
                style={{ height: '100%', borderRadius: 3 }}

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
                        height: '100%',
                        minWidth: 120,
                        borderRadius: 3,
                    }}
                >
                    <div style={{ height: '50%', minHeight: 120 }}
                    >
                        <InteractiveEditor />
                    </div>
                    <div style={{ height: '50%', minHeight: 120 }}
                    >
                        <Terminal />
                    </div>

                </Split>
                <div style={{ minWidth: 80, flex: 1, width: '50%' }}>
                    <Lobby />
                </div>
            </Split>
        </div>

    )
}
export default Workspace;