import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import { useMarkdownSync } from '../hooks/useMarkdownSync';
import { useValidation } from '../hooks/useValidation';
import { Toolbar } from './Toolbar';
import { MarkdownEditor } from './MarkdownEditor';
import { ValidationPanel } from './ValidationPanel';
import '../styles/editor.css';
export const TemplateEditor = (props) => {
    const { editor, nameRef, currentDoc } = useTemplateEditor(props);
    const { view, markdownText, setMarkdownText, toggleView } = useMarkdownSync(editor, nameRef);
    const showValidation = props.showValidation ?? true;
    const errors = useValidation(currentDoc.current, showValidation, props.onValidation);
    // Ctrl+M keyboard shortcut to toggle view
    const handleKeyDown = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            toggleView();
        }
    }, [toggleView]);
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    const theme = props.theme ?? 'light';
    return (_jsxs("div", { className: `ap-template-editor ${props.className ?? ''}`, "data-theme": theme, children: [(props.showToolbar ?? true) && (_jsx(Toolbar, { editor: editor, view: view, onToggleView: toggleView, showMarkdownToggle: props.showMarkdownToggle ?? true })), _jsx("div", { className: "ap-template-editor__body", children: view === 'rich' ? (_jsx(EditorContent, { editor: editor, className: "ap-template-editor__content" })) : (_jsx(MarkdownEditor, { value: markdownText, onChange: setMarkdownText, placeholder: props.placeholder })) }), showValidation && errors.length > 0 && _jsx(ValidationPanel, { errors: errors })] }));
};
