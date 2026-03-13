import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for ConditionalBlockDefinition blocks.
 * Block-level conditional with two editable branches (whenTrue/whenFalse).
 */
export const TemplateConditionalBlockNodeView = ({ node, updateAttributes, editor, deleteNode, }) => {
    const { name, condition } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftCondition, setDraftCondition] = useState(condition?.contents ?? '');
    const [activeTab, setActiveTab] = useState('true');
    const anchorRef = useRef(null);
    const isReadOnly = !editor.isEditable;
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftCondition(condition?.contents ?? '');
        setEditing(true);
    }, [name, condition]);
    const save = useCallback(() => {
        updateAttributes({
            name: draftName.trim() || 'condition',
            condition: draftCondition.trim()
                ? { type: 'ES_2020', contents: draftCondition.trim() }
                : null,
        });
        setEditing(false);
    }, [draftName, draftCondition, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && e.metaKey) {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const handleDelete = useCallback(() => {
        if (confirm('Delete this conditional block?')) {
            deleteNode();
        }
    }, [deleteNode]);
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 300, children: [_jsx("label", { className: popoverClasses.label, children: "Condition Variable" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "variable name" }), _jsx("label", { className: popoverClasses.label, children: "Condition Expression (optional)" }), _jsx("textarea", { value: draftCondition, onChange: (e) => setDraftCondition(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.textarea, placeholder: "e.g., value > 100", rows: 2 }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    const getTrueTabClasses = () => {
        const base = 'ap-block__tab ap-block__tab--true';
        return activeTab === 'true' ? `${base} ap-block__tab--active` : base;
    };
    const getFalseTabClasses = () => {
        const base = 'ap-block__tab ap-block__tab--false';
        return activeTab === 'false' ? `${base} ap-block__tab--active` : base;
    };
    return (_jsxs(NodeViewWrapper, { as: "div", className: "ap-block ap-block--conditional", children: [_jsxs("div", { ref: anchorRef, className: "ap-block__header", contentEditable: false, children: [_jsxs("div", { className: "ap-block__header-left", children: [_jsx("span", { className: "ap-block__icon", children: "\u2753" }), _jsx("strong", { children: "if:" }), _jsx("code", { className: "ap-block__code", children: name || 'condition' }), condition?.contents && (_jsxs("span", { className: "ap-block__condition", children: ["(", condition.contents, ")"] }))] }), !isReadOnly && (_jsxs("div", { className: "ap-block__actions", children: [_jsx("button", { onClick: openEdit, className: "ap-block__btn", title: "Edit condition", children: "\u270F\uFE0F" }), _jsx("button", { onClick: handleDelete, className: "ap-block__btn ap-block__btn--danger", title: "Delete", children: "\uD83D\uDDD1\uFE0F" })] }))] }), _jsxs("div", { className: "ap-block__tabs", contentEditable: false, children: [_jsx("button", { onClick: () => setActiveTab('true'), className: getTrueTabClasses(), children: "\u2713 True branch" }), _jsx("button", { onClick: () => setActiveTab('false'), className: getFalseTabClasses(), children: "\u2717 False branch" })] }), _jsx("div", { className: "ap-block__branch", children: _jsx(NodeViewContent, { className: "ap-block__content" }) }), popover] }));
};
