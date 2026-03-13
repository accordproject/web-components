import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for WithBlockDefinition blocks.
 * Block-level scoping context.
 */
export const TemplateWithBlockNodeView = ({ node, updateAttributes, editor, deleteNode, }) => {
    const { name, elementType } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftElementType, setDraftElementType] = useState(elementType ?? '');
    const anchorRef = useRef(null);
    const isReadOnly = !editor.isEditable;
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftElementType(elementType ?? '');
        setEditing(true);
    }, [name, elementType]);
    const save = useCallback(() => {
        updateAttributes({
            name: draftName.trim() || 'scope',
            elementType: draftElementType.trim() || null,
        });
        setEditing(false);
    }, [draftName, draftElementType, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const handleDelete = useCallback(() => {
        if (confirm('Delete this with block?')) {
            deleteNode();
        }
    }, [deleteNode]);
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 260, children: [_jsx("label", { className: popoverClasses.label, children: "Scope Variable" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "variable name" }), _jsx("label", { className: popoverClasses.label, children: "Element Type" }), _jsx("input", { value: draftElementType, onChange: (e) => setDraftElementType(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "org.example.MyType (optional)" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    return (_jsxs(NodeViewWrapper, { as: "div", className: "ap-block ap-block--with", children: [_jsxs("div", { ref: anchorRef, className: "ap-block__header", contentEditable: false, children: [_jsxs("div", { className: "ap-block__header-left", children: [_jsx("span", { className: "ap-block__icon", children: "\uD83D\uDD17" }), _jsx("strong", { children: "with:" }), _jsx("code", { className: "ap-block__code", children: name || 'variable' }), elementType && _jsx("span", { className: "ap-block__condition", children: elementType })] }), !isReadOnly && (_jsxs("div", { className: "ap-block__actions", children: [_jsx("button", { onClick: openEdit, className: "ap-block__btn", title: "Edit scope", children: "\u270F\uFE0F" }), _jsx("button", { onClick: handleDelete, className: "ap-block__btn ap-block__btn--danger", title: "Delete", children: "\uD83D\uDDD1\uFE0F" })] }))] }), _jsx(NodeViewContent, { className: "ap-block__content" }), popover] }));
};
