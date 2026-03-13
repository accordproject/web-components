import React from 'react';
import '../styles/editor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <textarea
      className="ap-template-editor__markdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Enter TemplateMark markdown...'}
      spellCheck={false}
    />
  );
};
