"use client";
import React from 'react';
import Terminal from './Terminal';
import InteractiveEditor from './InteractiveEditor';
import Split from '@uiw/react-split';


const CodeEditor: React.FC = () => {

    return (
        <Split
            mode="vertical"
            renderBar={({ onMouseDown, ...props }) => {
                return (
                    <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
                        <div onMouseDown={onMouseDown} style={{ backgroundColor: '#404040', boxShadow: "none" }} />
                    </div>
                );
            }}
            style={{
                height: '100%',
                flexDirection: 'column',
                borderRadius: 3,
            }}
        >
            <div style={{ height: '50%', minHeight: 80 }}
            >
                <InteractiveEditor />
            </div>
            <div style={{ height: '50%', minHeight: 120 }}
            >
                <Terminal />
            </div>

        </Split>
    )
}
export default CodeEditor;