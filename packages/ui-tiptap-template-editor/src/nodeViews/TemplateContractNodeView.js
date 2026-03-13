import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for ContractDefinition blocks.
 * Displays contract document wrapper with metadata header.
 */
export const TemplateContractNodeView = ({ node, updateAttributes, editor, }) => {
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
            name: draftName.trim() || 'contract',
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
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 280, children: [_jsx("label", { className: popoverClasses.label, children: "Contract Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "contract name" }), _jsx("label", { className: popoverClasses.label, children: "Element Type" }), _jsx("input", { value: draftElementType, onChange: (e) => setDraftElementType(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "org.example.MyContract (optional)" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    return (_jsxs(NodeViewWrapper, { as: "div", className: "ap-block ap-block--clause", children: [_jsxs("div", { ref: anchorRef, className: "ap-block__header", contentEditable: false, children: [_jsxs("div", { className: "ap-block__header-left", children: [_jsx("span", { className: "ap-block__icon", children: "\uD83D\uDCC4" }), _jsx("strong", { children: "Contract:" }), _jsx("span", { className: "ap-block__name", children: name || 'Unnamed Contract' })] }), !isReadOnly && (_jsx("button", { onClick: openEdit, className: "ap-block__btn", title: "Edit contract metadata", children: "\u270F\uFE0F" }))] }), _jsx(NodeViewContent, { className: "ap-block__content" }), popover] }));
};
