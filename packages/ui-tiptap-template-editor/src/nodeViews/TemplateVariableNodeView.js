import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import { PRIMITIVE_TYPES, ACCORD_PROJECT_TYPES, getFriendlyTypeName, getFullTypeName, getBadgeModifier, } from '../constants/types';
import '../styles/nodeview.css';
export const TemplateVariableNodeView = ({ node, updateAttributes }) => {
    const { name, elementType } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftType, setDraftType] = useState(elementType ?? 'String');
    const anchorRef = useRef(null);
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftType(elementType ?? 'String');
        setEditing(true);
    }, [name, elementType]);
    const save = useCallback(() => {
        if (draftName.trim()) {
            updateAttributes({ name: draftName.trim(), elementType: getFullTypeName(draftType) });
        }
        setEditing(false);
    }, [draftName, draftType, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const popover = editing ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, children: [_jsx("label", { className: popoverClasses.label, children: "Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "variable name" }), _jsx("label", { className: popoverClasses.label, children: "Type" }), _jsxs("select", { value: getFriendlyTypeName(draftType), onChange: (e) => setDraftType(e.target.value), className: popoverClasses.select, children: [_jsx("optgroup", { label: "Primitives", children: PRIMITIVE_TYPES.map((t) => _jsx("option", { value: t, children: t }, t)) }), _jsx("optgroup", { label: "Accord Project", children: Object.keys(ACCORD_PROJECT_TYPES).map((t) => _jsx("option", { value: t, children: t }, t)) })] }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body) : null;
    const badgeClass = `ap-badge ap-badge--${getBadgeModifier(elementType)}`;
    const friendlyType = getFriendlyTypeName(elementType ?? 'String');
    return (_jsxs(NodeViewWrapper, { as: "span", children: [_jsxs("span", { ref: anchorRef, onClick: openEdit, contentEditable: false, className: badgeClass, title: `Variable: ${name} (${friendlyType}) — click to edit`, children: ['{{ ', name, ' : ', _jsx("em", { className: "ap-badge__type", children: friendlyType }), ' }}'] }), popover] }));
};
// ── TemplateFormattedVariableNodeView ─────────────────────────────────────────
export const TemplateFormattedVariableNodeView = ({ node, updateAttributes, }) => {
    const { name, elementType, format } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftType, setDraftType] = useState(elementType ?? 'DateTime');
    const [draftFormat, setDraftFormat] = useState(format ?? '');
    const anchorRef = useRef(null);
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftType(elementType ?? 'DateTime');
        setDraftFormat(format ?? '');
        setEditing(true);
    }, [name, elementType, format]);
    const save = useCallback(() => {
        if (draftName.trim()) {
            updateAttributes({ name: draftName.trim(), elementType: getFullTypeName(draftType), format: draftFormat.trim() || undefined });
        }
        setEditing(false);
    }, [draftName, draftType, draftFormat, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape')
            cancel();
    }, [save, cancel]);
    const popover = editing ? ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, children: [_jsx("label", { className: popoverClasses.label, children: "Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input }), _jsx("label", { className: popoverClasses.label, children: "Type" }), _jsxs("select", { value: getFriendlyTypeName(draftType), onChange: (e) => setDraftType(e.target.value), className: popoverClasses.select, children: [_jsx("optgroup", { label: "Primitives", children: PRIMITIVE_TYPES.map((t) => _jsx("option", { value: t, children: t }, t)) }), _jsx("optgroup", { label: "Accord Project", children: Object.keys(ACCORD_PROJECT_TYPES).map((t) => _jsx("option", { value: t, children: t }, t)) })] }), _jsx("label", { className: popoverClasses.label, children: "Format" }), _jsx("input", { value: draftFormat, onChange: (e) => setDraftFormat(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.input, placeholder: "e.g. YYYY-MM-DD or 0,0.00 CCC" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body) : null;
    const friendlyType = getFriendlyTypeName(elementType ?? 'DateTime');
    return (_jsxs(NodeViewWrapper, { as: "span", children: [_jsxs("span", { ref: anchorRef, onClick: openEdit, contentEditable: false, className: "ap-badge ap-badge--formatted", title: `Formatted variable: ${name} (${friendlyType}${format ? ' | ' + format : ''}) — click to edit`, children: ['{{ ', name, ' : ', _jsx("em", { className: "ap-badge__type", children: friendlyType }), format && _jsxs("span", { className: "ap-badge__format", children: [' | ', format] }), ' }}'] }), popover] }));
};
