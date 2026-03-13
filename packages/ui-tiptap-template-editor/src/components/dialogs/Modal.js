import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import '../../styles/modal.css';
/**
 * A centered modal dialog with backdrop.
 */
export const Modal = ({ title, onClose, children }) => {
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "ap-modal-backdrop", onClick: onClose }), _jsxs("div", { className: "ap-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "ap-modal__header", children: [_jsx("span", { className: "ap-modal__title", children: title }), _jsx("button", { className: "ap-modal__close", onClick: onClose, "aria-label": "Close", children: "\u2715" })] }), children] })] }));
};
/**
 * Modal for editing multiple TemplateMark branches (e.g., whenTrue/whenFalse).
 */
export const BranchModal = ({ title, branches, onSave, onClose, helpText = 'Edit each branch as TemplateMark markdown. Use {{varName}} for variables.', }) => {
    const [values, setValues] = useState(branches.map((b) => b.initialMd));
    const handleSave = useCallback(() => onSave(values), [onSave, values]);
    const update = (i, v) => setValues((prev) => prev.map((x, j) => (j === i ? v : x)));
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "ap-modal-backdrop", onClick: onClose }), _jsxs("div", { className: "ap-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "ap-modal__header", children: [_jsx("span", { className: "ap-modal__title", children: title }), _jsx("button", { className: "ap-modal__close", onClick: onClose, "aria-label": "Close", children: "\u2715" })] }), _jsxs("div", { className: "ap-modal__body", children: [_jsx("p", { className: "ap-modal__help", children: helpText }), branches.map((b, i) => (_jsxs("div", { className: "ap-modal__field", children: [_jsx("label", { className: "ap-modal__label", children: b.label }), _jsx("textarea", { className: "ap-modal__textarea", value: values[i], onChange: (e) => update(i, e.target.value), spellCheck: false, rows: 5 })] }, i)))] }), _jsxs("div", { className: "ap-modal__footer", children: [_jsx("button", { className: "ap-modal__btn ap-modal__btn--secondary", onClick: onClose, children: "Cancel" }), _jsx("button", { className: "ap-modal__btn ap-modal__btn--primary", onClick: handleSave, children: "Save branches" })] })] })] }));
};
/**
 * Generic insert dialog for toolbar buttons (Variable, Clause, Image, etc.)
 */
export const InsertDialog = ({ title, fields, onInsert, onClose, }) => {
    const initialValues = {};
    fields.forEach((f) => { initialValues[f.name] = f.defaultValue ?? ''; });
    const [values, setValues] = useState(initialValues);
    const update = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
    const handleInsert = () => {
        for (const f of fields) {
            if (f.required && !values[f.name]?.trim())
                return;
        }
        onInsert(values);
        onClose();
    };
    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' && e.metaKey) || (e.key === 'Enter' && e.ctrlKey))
            handleInsert();
        if (e.key === 'Escape')
            onClose();
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "ap-modal-backdrop", onClick: onClose }), _jsxs("div", { className: "ap-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "ap-modal__header", children: [_jsx("span", { className: "ap-modal__title", children: title }), _jsx("button", { className: "ap-modal__close", onClick: onClose, "aria-label": "Close", children: "\u2715" })] }), _jsx("div", { className: "ap-modal__body", onKeyDown: handleKeyDown, children: fields.map((f, i) => (_jsxs("div", { className: "ap-modal__field", children: [_jsxs("label", { className: "ap-modal__label", children: [f.label, f.required && _jsx("span", { className: "ap-modal__required", children: "*" })] }), f.type === 'text' && (_jsx("input", { className: "ap-modal__input", autoFocus: i === 0, value: values[f.name], onChange: (e) => update(f.name, e.target.value), placeholder: f.placeholder })), f.type === 'select' && (_jsx("select", { className: "ap-modal__select", value: values[f.name], onChange: (e) => update(f.name, e.target.value), children: f.options?.map((opt) => (_jsx("option", { value: opt, children: opt }, opt))) })), f.type === 'textarea' && (_jsx("textarea", { className: "ap-modal__textarea", value: values[f.name], onChange: (e) => update(f.name, e.target.value), placeholder: f.placeholder, rows: 3 }))] }, f.name))) }), _jsxs("div", { className: "ap-modal__footer", children: [_jsx("button", { className: "ap-modal__btn ap-modal__btn--secondary", onClick: onClose, children: "Cancel" }), _jsx("button", { className: "ap-modal__btn ap-modal__btn--primary", onClick: handleInsert, children: "Insert" })] })] })] }));
};
