import React, { useEffect, useRef } from 'react';
import { JsonEditor } from 'jsoneditor-react';

import 'jsoneditor-react/es/editor.min.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ControlledJsonEditor = ({ value, onChange, ...props }) => {
    const jsonEditorRef = useRef();
    useEffect(() => {
        const editor =
            jsonEditorRef &&
            jsonEditorRef.current &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            jsonEditorRef.current.jsonEditor;
        if (editor && value) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            editor.update(value);
        }
    }, [jsonEditorRef, value]);

    return (
        <JsonEditor
            ref={jsonEditorRef}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};
