import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for ClauseDefinition blocks.
 * Displays clause with header, edit functionality, and nested content.
 */
export const TemplateClauseNodeView = ({ node, updateAttributes, editor, deleteNode, clauseOptions, }) => {
    const { name, src, elementType, condition, error } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftSrc, setDraftSrc] = useState(src ?? '');
    const [draftElementType, setDraftElementType] = useState(elementType ?? '');
    const anchorRef = useRef(null);
    const isReadOnly = !editor.isEditable;
    const displayName = src ? src.split('@')[0].split('/').pop() ?? name : name || 'Unnamed Clause';
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftSrc(src ?? '');
        setDraftElementType(elementType ?? '');
        setEditing(true);
    }, [name, src, elementType]);
    const save = useCallback(() => {
        updateAttributes({
            name: draftName.trim() || 'clause',
            src: draftSrc.trim() || null,
            elementType: draftElementType.trim() || null,
        });
        setEditing(false);
    }, [draftName, draftSrc, draftElementType, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const handleDelete = useCallback(() => {
        if (confirm('Delete this clause?')) {
            deleteNode();
        }
    }, [deleteNode]);
    const handleExternalEdit = useCallback(() => {
        if (src && clauseOptions?.onClauseEdit) {
            clauseOptions.onClauseEdit(src);
        }
    }, [src, clauseOptions]);
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 280, children: [_jsx("label", { className: popoverClasses.label, children: "Clause Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "clause name" }), _jsx("label", { className: popoverClasses.label, children: "Source (URL)" }), _jsx("input", { value: draftSrc, onChange: (e) => setDraftSrc(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "https://... (optional)" }), _jsx("label", { className: popoverClasses.label, children: "Element Type" }), _jsx("input", { value: draftElementType, onChange: (e) => setDraftElementType(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "org.example.MyClause (optional)" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    const wrapperClasses = `ap-block ap-block--clause${error ? ' ap-block--error' : ''}`;
    return (_jsxs(NodeViewWrapper, { as: "div", className: wrapperClasses, children: [_jsxs("div", { ref: anchorRef, className: "ap-block__header", contentEditable: false, children: [_jsxs("div", { className: "ap-block__header-left", children: [_jsx("span", { className: "ap-block__icon", children: "\uD83D\uDCCB" }), _jsx("strong", { children: "Clause:" }), _jsx("span", { className: "ap-block__name", children: displayName }), error && _jsxs("span", { className: "ap-block__error", children: ["\u26A0 ", error] })] }), !isReadOnly && (_jsxs("div", { className: "ap-block__actions", children: [_jsx("button", { onClick: openEdit, className: "ap-block__btn", title: "Edit clause metadata", children: "\u270F\uFE0F" }), src && clauseOptions?.onClauseEdit && (_jsx("button", { onClick: handleExternalEdit, className: "ap-block__btn", title: "Open clause source", children: "\uD83D\uDD17" })), _jsx("button", { onClick: handleDelete, className: "ap-block__btn ap-block__btn--danger", title: "Delete clause", children: "\uD83D\uDDD1\uFE0F" })] }))] }), _jsx(NodeViewContent, { className: "ap-block__content" }), popover] }));
};
