"use client";

import React, { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const InteractiveEditor: React.FC = () => {
    const [code, setCode] = useState<string>("// Write your JavaScript code here");

    const handleEditorChange = useCallback((value: string) => {
        setCode(value);
    }, []);

    return (
        <CodeMirror
            value={code}
            height="100%"
            extensions={[javascript()]}
            theme="dark"
            onChange={handleEditorChange}
            basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                foldGutter: true,
                highlightSelectionMatches: true,
                indentOnInput: true,
                defaultKeymap: true,
                history: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                tabSize: 2,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                lintKeymap: true,
                searchKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                closeBracketsKeymap: true,
                syntaxHighlighting: true,
            }}
        />
    );
};

export default InteractiveEditor;
