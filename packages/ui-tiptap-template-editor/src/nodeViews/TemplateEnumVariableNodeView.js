import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';
export const TemplateEnumVariableNodeView = ({ node, updateAttributes, }) => {
    const { name, enumValues } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftValues, setDraftValues] = useState((enumValues ?? []).join(', '));
    const anchorRef = useRef(null);
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftValues((enumValues ?? []).join(', '));
        setEditing(true);
    }, [name, enumValues]);
    const save = useCallback(() => {
        if (!draftName.trim()) {
            setEditing(false);
            return;
        }
        const parsed = draftValues.split(',').map((v) => v.trim()).filter(Boolean);
        updateAttributes({
            name: draftName.trim(),
            enumValues: parsed,
            value: parsed[0] ?? '',
        });
        setEditing(false);
    }, [draftName, draftValues, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const display = (enumValues ?? []).join(' | ');
    const popover = editing && ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 240, children: [_jsx("label", { className: popoverClasses.label, children: "Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "variable name" }), _jsx("label", { className: popoverClasses.label, children: "Enum values (comma-separated)" }), _jsx("input", { value: draftValues, onChange: (e) => setDraftValues(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "e.g. California, New York, Delaware" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body);
    return (_jsxs(NodeViewWrapper, { as: "span", children: [_jsxs("span", { ref: anchorRef, onClick: openEdit, contentEditable: false, className: "ap-badge ap-badge--enum", title: `Enum variable: ${name} — click to edit`, children: ['{{ ', name, ' : [', _jsx("em", { className: "ap-badge__type", children: display || '…' }), '] }}'] }), popover] }));
};
