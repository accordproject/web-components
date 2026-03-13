import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { TemplateEditor } from '@accordproject/ui-tiptap-template-editor';
import { JsonPanel } from './components/JsonPanel';
import { ndaTemplate } from './fixtures/ndaTemplate';
import { serviceTemplate } from './fixtures/serviceTemplate';
export default function App() {
    const [doc, setDoc] = useState(ndaTemplate);
    const [validationErrors, setValidationErrors] = useState([]);
    const [activeTab, setActiveTab] = useState('concerto');
    const handleChange = useCallback((d) => {
        setDoc(d);
    }, []);
    const handleValidation = useCallback((errors) => {
        setValidationErrors(errors);
    }, []);
    const loadTemplate = (template) => {
        setDoc({ ...template });
    };
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }, children: [_jsxs("header", { style: headerStyle, children: [_jsx("span", { style: { fontWeight: 700, fontSize: '15px', marginRight: 12 }, children: "Accord Project \u2014 Template Editor Demo" }), _jsx("button", { onClick: () => loadTemplate(ndaTemplate), style: btnStyle(doc === ndaTemplate), children: "NDA Template" }), _jsx("button", { onClick: () => loadTemplate(serviceTemplate), style: btnStyle(doc === serviceTemplate), children: "Services Agreement" }), _jsx("div", { style: { flex: 1 } }), validationErrors.length > 0 && (_jsxs("span", { style: { fontSize: 12, color: '#fc8181', marginRight: 12 }, children: ["\u26D4 ", validationErrors.length, " validation error", validationErrors.length > 1 ? 's' : ''] })), validationErrors.length === 0 && (_jsx("span", { style: { fontSize: 12, color: '#68d391', marginRight: 12 }, children: "\u2713 Valid" }))] }), _jsxs("main", { style: mainStyle, children: [_jsx("div", { style: { ...panelWrapStyle, gridRow: '1 / 3' }, children: _jsx(PanelShell, { title: "Template Editor", children: _jsx(TemplateEditor, { value: doc, onChange: handleChange, onValidation: handleValidation, showValidation: true, showToolbar: true, className: "demo-editor", placeholder: "Start typing your template..." }) }) }), _jsx("div", { style: panelWrapStyle, children: _jsxs("div", { style: tabbedContainerStyle, children: [_jsx("div", { style: tabBarStyle, children: _jsx("button", { style: tabStyle(activeTab === 'json'), onClick: () => setActiveTab('json'), children: "TemplateMark JSON" }) }), _jsx("div", { style: { flex: 1, overflow: 'hidden' }, children: _jsx(JsonPanel, { value: doc }) })] }) })] })] }));
}
// ── Sub-components ────────────────────────────────────────────────────────────
function PanelShell({ title, children }) {
    return (_jsxs("div", { style: panelShellStyle, children: [_jsx("div", { style: panelHeaderStyle, children: title }), _jsx("div", { style: { flex: 1, overflow: 'auto', padding: 8 }, children: children })] }));
}
// ── Styles ────────────────────────────────────────────────────────────────────
const headerStyle = {
    background: '#2d3748',
    color: '#fff',
    padding: '9px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    flexWrap: 'wrap',
};
const mainStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: 10,
    padding: 10,
    overflow: 'hidden',
    minHeight: 0,
};
const panelWrapStyle = {
    overflow: 'hidden',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
};
const panelShellStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
};
const panelHeaderStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f7fafc',
    fontSize: 13,
    fontWeight: 600,
    color: '#4a5568',
    flexShrink: 0,
};
const tabbedContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
};
const tabBarStyle = {
    display: 'flex',
    background: '#f7fafc',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
};
const tabStyle = (active) => ({
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? '#2b6cb0' : '#718096',
    background: active ? '#fff' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #3182ce' : '2px solid transparent',
    cursor: 'pointer',
    outline: 'none',
});
const btnStyle = (active) => ({
    background: active ? '#4299e1' : '#4a5568',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
});
const codeStyle = {
    background: '#2d3748',
    color: '#fbd38d',
    borderRadius: 3,
    padding: '1px 5px',
    fontSize: 11,
    fontFamily: 'monospace',
};
