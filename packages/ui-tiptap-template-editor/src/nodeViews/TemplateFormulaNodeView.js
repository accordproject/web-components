import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import { PRIMITIVE_TYPES, ACCORD_PROJECT_TYPES, getFriendlyTypeName, getFullTypeName, } from '../constants/types';
import '../styles/nodeview.css';
export const TemplateFormulaNodeView = ({ node, updateAttributes }) => {
    const { name, elementType, codeContents } = node.attrs;
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState(name);
    const [draftType, setDraftType] = useState(elementType ?? 'Double');
    const [draftCode, setDraftCode] = useState(codeContents ?? '');
    const anchorRef = useRef(null);
    const openEdit = useCallback((e) => {
        e.stopPropagation();
        setDraftName(name);
        setDraftType(elementType ?? 'Double');
        setDraftCode(codeContents ?? '');
        setEditing(true);
    }, [name, elementType, codeContents]);
    const save = useCallback(() => {
        if (!draftName.trim()) {
            setEditing(false);
            return;
        }
        updateAttributes({
            name: draftName.trim(),
            elementType: getFullTypeName(draftType),
            codeContents: draftCode,
        });
        setEditing(false);
    }, [draftName, draftType, draftCode, updateAttributes]);
    const cancel = useCallback(() => setEditing(false), []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape')
            cancel();
        // Don't submit on Enter — the textarea needs Enter for newlines
    }, [cancel]);
    const popover = editing && ReactDOM.createPortal(_jsxs(Popover, { anchor: anchorRef.current, onClose: cancel, width: 320, children: [_jsx("label", { className: popoverClasses.label, children: "Name" }), _jsx("input", { autoFocus: true, value: draftName, onChange: (e) => setDraftName(e.target.value), onKeyDown: (e) => { if (e.key === 'Escape')
                    cancel(); }, className: popoverClasses.input, placeholder: "formula name" }), _jsx("label", { className: popoverClasses.label, children: "Return type" }), _jsxs("select", { value: getFriendlyTypeName(draftType), onChange: (e) => setDraftType(e.target.value), className: popoverClasses.select, children: [_jsx("optgroup", { label: "Primitives", children: PRIMITIVE_TYPES.map((t) => _jsx("option", { value: t, children: t }, t)) }), _jsx("optgroup", { label: "Accord Project", children: Object.keys(ACCORD_PROJECT_TYPES).map((t) => _jsx("option", { value: t, children: t }, t)) })] }), _jsx("label", { className: popoverClasses.label, children: "TypeScript expression" }), _jsx("textarea", { value: draftCode, onChange: (e) => setDraftCode(e.target.value), onKeyDown: handleKeyDown, className: popoverClasses.textarea, rows: 4, spellCheck: false, placeholder: "e.g. data.price * data.quantity" }), _jsxs("div", { className: popoverClasses.buttonRow, children: [_jsx("button", { onClick: save, className: popoverClasses.saveBtn, children: "Save" }), _jsx("button", { onClick: cancel, className: popoverClasses.cancelBtn, children: "Cancel" })] })] }), document.body);
    const friendlyType = getFriendlyTypeName(elementType ?? 'Double');
    return (_jsxs(NodeViewWrapper, { as: "span", children: [_jsxs("span", { ref: anchorRef, onClick: openEdit, contentEditable: false, className: "ap-badge ap-badge--formula", title: `Formula: ${name} (${friendlyType}) — click to edit`, children: [_jsx("span", { className: "ap-badge__sigil", children: "\u0192" }), ' ', name, elementType && _jsxs("em", { className: "ap-badge__type", children: [' : ', friendlyType] }), codeContents && (_jsxs("span", { className: "ap-badge__code-preview", children: [' = ', codeContents.length > 24 ? codeContents.slice(0, 24) + '…' : codeContents] }))] }), popover] }));
};
