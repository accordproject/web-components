import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const JsonPanel = ({ value, title = 'TemplateMark JSON' }) => {
    return (_jsxs("div", { style: containerStyle, children: [_jsx("div", { style: headerStyle, children: title }), _jsx("pre", { style: preStyle, children: value ? JSON.stringify(value, null, 2) : '(empty)' })] }));
};
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
};
const headerStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f7fafc',
    fontSize: '13px',
    fontWeight: 600,
    color: '#4a5568',
    flexShrink: 0,
};
const preStyle = {
    flex: 1,
    margin: 0,
    padding: '12px',
    fontSize: '11px',
    lineHeight: 1.5,
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    background: '#1a202c',
    color: '#68d391',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
};
