import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
/**
 * NodeView for OptionalBlockDefinition blocks.
 * Block-level optional with two editable branches (whenSome/whenNone).
 */
export const TemplateOptionalBlockNodeView = ({ node, updateAttributes, editor, deleteNode, }) => {
    const { name } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [activeTab, setActiveTab] = useState('some');
    const anchorRef = useRef(null);
    const isReadOnly = !editor.isEditable;
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setEditing(true);
    }, [name]);
    const save = useCallback(() => {
        updateAttributes({
            name: draftName.trim() || 'optional',
        });
        setEditing(false);
    }, [draftName, updateAttributes]);
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
        if (confirm('Delete this optional block?')) {
            deleteNode();
        }
    }, [deleteNode]);
    const popover = editing
        ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 260, children: [_jsx("label", { className: popoverClasses.label, children: "Optional Variable" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "variable name" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body)
        : null;
    const getSomeTabClasses = () => {
        const base = 'ap-block__tab ap-block__tab--true';
        return activeTab === 'some' ? `${base} ap-block__tab--active` : base;
    };
    const getNoneTabClasses = () => {
        const base = 'ap-block__tab ap-block__tab--false';
        return activeTab === 'none' ? `${base} ap-block__tab--active` : base;
    };
    return (_jsxs(NodeViewWrapper, { as: "div", className: "ap-block ap-block--optional", children: [_jsxs("div", { ref: anchorRef, className: "ap-block__header", contentEditable: false, children: [_jsxs("div", { className: "ap-block__header-left", children: [_jsx("span", { className: "ap-block__icon", children: "\u25FB" }), _jsx("strong", { children: "optional:" }), _jsx("code", { className: "ap-block__code", children: name || 'variable' })] }), !isReadOnly && (_jsxs("div", { className: "ap-block__actions", children: [_jsx("button", { onClick: openEdit, className: "ap-block__btn", title: "Edit optional variable", children: "\u270F\uFE0F" }), _jsx("button", { onClick: handleDelete, className: "ap-block__btn ap-block__btn--danger", title: "Delete", children: "\uD83D\uDDD1\uFE0F" })] }))] }), _jsxs("div", { className: "ap-block__tabs", contentEditable: false, children: [_jsx("button", { onClick: () => setActiveTab('some'), className: getSomeTabClasses(), children: "\u2713 When present" }), _jsx("button", { onClick: () => setActiveTab('none'), className: getNoneTabClasses(), children: "\u2205 When absent" })] }), _jsx("div", { className: "ap-block__branch", children: _jsx(NodeViewContent, { className: "ap-block__content" }) }), popover] }));
};
