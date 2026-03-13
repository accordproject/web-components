import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { branchToMarkdown, markdownToBranch, branchPreview } from '../utils/branchMarkdown';
export const TemplateOptionalNodeView = ({ node, updateAttributes, }) => {
    const { name, whenSomeJson, whenNoneJson } = node.attrs;
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = useCallback((e) => {
        e.stopPropagation();
        setModalOpen(true);
    }, []);
    const handleSave = useCallback((someMd, noneMd) => {
        updateAttributes({
            whenSomeJson: markdownToBranch(someMd),
            whenNoneJson: markdownToBranch(noneMd),
        });
        setModalOpen(false);
    }, [updateAttributes]);
    const somePreview = branchPreview(whenSomeJson || '[]');
    const nonePreview = branchPreview(whenNoneJson || '[]');
    return (_jsxs(NodeViewWrapper, { as: "span", children: [_jsxs("span", { contentEditable: false, style: wrapStyle, children: [_jsxs("span", { style: pillStyle('#e9d8fd', '#44337a', '#9f7aea'), children: [_jsx("span", { style: labelStyle, children: "optional: " }), _jsx("strong", { children: name })] }), _jsxs("span", { style: branchStyle('#faf5ff'), children: [_jsx("span", { style: branchLabel, children: "some" }), _jsx("span", { style: previewStyle, children: somePreview || '(empty)' })] }), _jsx("span", { style: dividerStyle, children: "|" }), _jsxs("span", { style: branchStyle('#fff5f5'), children: [_jsx("span", { style: branchLabel, children: "none" }), _jsx("span", { style: previewStyle, children: nonePreview || '(empty)' })] }), _jsx("button", { onClick: openModal, contentEditable: false, style: editBtnStyle, title: "Edit branches", children: "\u270F Edit" })] }), modalOpen &&
                ReactDOM.createPortal(_jsx(BranchModal, { title: `Edit optional: ${name}`, branches: [
                        { label: 'Some branch (when present)', initialMd: branchToMarkdown(whenSomeJson || '[]') },
                        { label: 'None branch (when absent)', initialMd: branchToMarkdown(whenNoneJson || '[]') },
                    ], onSave: ([someMd, noneMd]) => handleSave(someMd, noneMd), onClose: () => setModalOpen(false) }), document.body)] }));
};
function BranchModal({ title, branches, onSave, onClose }) {
    const [values, setValues] = useState(branches.map((b) => b.initialMd));
    const handleSave = useCallback(() => onSave(values), [onSave, values]);
    const update = (i, v) => setValues((prev) => prev.map((x, j) => (j === i ? v : x)));
    return (_jsxs(_Fragment, { children: [_jsx("div", { onClick: onClose, style: backdropStyle }), _jsxs("div", { style: modalStyle, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { style: modalHeaderStyle, children: [_jsx("span", { style: { fontWeight: 600, fontSize: 15 }, children: title }), _jsx("button", { onClick: onClose, style: closeBtnStyle, children: "\u2715" })] }), _jsxs("div", { style: modalBodyStyle, children: [_jsxs("p", { style: { margin: '0 0 10px', fontSize: 13, color: '#718096' }, children: ["Edit each branch as TemplateMark markdown. Use ", _jsx("code", { children: '{{varName}}' }), " for variables."] }), branches.map((b, i) => (_jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("label", { style: modalLabelStyle, children: b.label }), _jsx("textarea", { value: values[i], onChange: (e) => update(i, e.target.value), style: textareaStyle, spellCheck: false, rows: 5 })] }, i)))] }), _jsxs("div", { style: modalFooterStyle, children: [_jsx("button", { onClick: onClose, style: cancelBtnStyle, children: "Cancel" }), _jsx("button", { onClick: handleSave, style: saveBtnStyle, children: "Save branches" })] })] })] }));
}
// ── Styles ────────────────────────────────────────────────────────────────────
const wrapStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: '1px solid #9f7aea',
    borderRadius: 4,
    padding: '1px 4px',
    background: '#faf5ff',
    verticalAlign: 'middle',
};
const pillStyle = (bg, color, border) => ({
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 3,
    padding: '0 4px',
    color,
    fontSize: 12,
    whiteSpace: 'nowrap',
});
const labelStyle = {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    opacity: 0.7,
};
const branchStyle = (bg) => ({
    background: bg,
    borderRadius: 3,
    padding: '0 4px',
    fontSize: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    maxWidth: 160,
    overflow: 'hidden',
});
const branchLabel = {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 600,
    opacity: 0.6,
    flexShrink: 0,
};
const previewStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#4a5568',
};
const dividerStyle = {
    color: '#a0aec0',
    fontSize: 12,
};
const editBtnStyle = {
    background: '#f3e8ff',
    border: '1px solid #c084fc',
    borderRadius: 3,
    padding: '0 6px',
    fontSize: 11,
    cursor: 'pointer',
    color: '#7c3aed',
    flexShrink: 0,
};
const backdropStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 1000,
};
const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1001,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    width: 540,
    maxWidth: '95vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
};
const modalHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
};
const modalBodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
};
const modalFooterStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    flexShrink: 0,
};
const modalLabelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
};
const textareaStyle = {
    width: '100%',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    fontSize: 13,
    lineHeight: 1.5,
    padding: '8px 10px',
    border: '1px solid #cbd5e0',
    borderRadius: 4,
    background: '#1a202c',
    color: '#e2e8f0',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
};
const saveBtnStyle = {
    padding: '6px 16px',
    background: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
};
const cancelBtnStyle = {
    padding: '6px 16px',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
};
const closeBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    color: '#718096',
    lineHeight: 1,
    padding: '2px 4px',
};
