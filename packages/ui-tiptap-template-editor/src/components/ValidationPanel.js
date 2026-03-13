import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ValidationPanel = ({ errors }) => {
    if (errors.length === 0)
        return null;
    return (_jsx("div", { className: "ap-template-editor__validation", role: "alert", children: errors.map((err, i) => (_jsxs("div", { className: `ap-template-editor__validation-item ap-template-editor__validation-item--${err.severity}`, children: [_jsx("span", { className: "ap-template-editor__validation-icon", children: err.severity === 'error' ? '⛔' : '⚠️' }), _jsx("span", { className: "ap-template-editor__validation-message", children: err.message }), err.location && (err.location.line != null || err.location.nodeType) && (_jsxs("span", { className: "ap-template-editor__validation-location", children: [err.location.line != null && (_jsxs("span", { children: [err.location.line, err.location.column != null ? `:${err.location.column}` : ''] })), err.location.nodeType && (_jsxs("span", { children: [' ', "[", err.location.nodeType, err.location.nodeName ? ` "${err.location.nodeName}"` : '', "]"] }))] }))] }, i))) }));
};
