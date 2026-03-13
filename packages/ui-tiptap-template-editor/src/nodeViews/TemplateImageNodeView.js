import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for Image nodes with click-to-edit functionality.
 */
export const TemplateImageNodeView = ({ node, updateAttributes, editor, selected, }) => {
    const { src, alt, title } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftSrc, setDraftSrc] = useState(src ?? '');
    const [draftAlt, setDraftAlt] = useState(alt ?? '');
    const [draftTitle, setDraftTitle] = useState(title ?? '');
    const anchorRef = useRef(null);
    const isReadOnly = !editor.isEditable;
    const openEdit = useCallback((e) => {
        if (isReadOnly)
            return;
        e.stopPropagation();
        setDraftSrc(src ?? '');
        setDraftAlt(alt ?? '');
        setDraftTitle(title ?? '');
        setEditing(true);
    }, [src, alt, title, isReadOnly]);
    const save = useCallback(() => {
        updateAttributes({
            src: draftSrc.trim() || null,
            alt: draftAlt.trim() || null,
            title: draftTitle.trim() || null,
        });
        setEditing(false);
    }, [draftSrc, draftAlt, draftTitle, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 300, children: [_jsx("label", { className: popoverClasses.label, children: "Image URL" }), _jsx("input", { autoFocus: true, value: draftSrc, onChange: (e) => setDraftSrc(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "https://example.com/image.png" }), _jsx("label", { className: popoverClasses.label, children: "Alt Text" }), _jsx("input", { value: draftAlt, onChange: (e) => setDraftAlt(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "Description of image" }), _jsx("label", { className: popoverClasses.label, children: "Title (tooltip)" }), _jsx("input", { value: draftTitle, onChange: (e) => setDraftTitle(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "Optional title" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    const wrapperClass = [
        'ap-image__wrapper',
        selected && 'ap-image__wrapper--selected',
        !isReadOnly && 'ap-image__wrapper--editable',
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs(NodeViewWrapper, { as: "span", className: "ap-image", children: [_jsx("span", { ref: anchorRef, onClick: openEdit, className: wrapperClass, children: src ? (_jsx("img", { src: src, alt: alt ?? '', title: title ?? undefined, className: "ap-image__img" })) : (_jsx("span", { className: "ap-image__placeholder", children: "\uD83D\uDDBC\uFE0F No image URL" })) }), popover] }));
};
