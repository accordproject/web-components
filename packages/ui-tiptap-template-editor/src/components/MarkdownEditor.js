import { jsx as _jsx } from "react/jsx-runtime";
import '../styles/editor.css';
export const MarkdownEditor = ({ value, onChange, placeholder, }) => {
    return (_jsx("textarea", { className: "ap-template-editor__markdown", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder ?? 'Enter TemplateMark markdown...', spellCheck: false }));
};
