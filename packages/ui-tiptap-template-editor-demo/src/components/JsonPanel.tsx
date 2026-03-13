import React from 'react';
import type { TemplateMarkDocument } from '@accordproject/ui-tiptap-template-editor';

interface JsonPanelProps {
  value: TemplateMarkDocument | null;
  title?: string;
}

export const JsonPanel: React.FC<JsonPanelProps> = ({ value, title = 'TemplateMark JSON' }) => {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>{title}</div>
      <pre style={preStyle}>
        {value ? JSON.stringify(value, null, 2) : '(empty)'}
      </pre>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f7fafc',
  fontSize: '13px',
  fontWeight: 600,
  color: '#4a5568',
  flexShrink: 0,
};

const preStyle: React.CSSProperties = {
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
