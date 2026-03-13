import React, { useState, useCallback } from 'react';
import { ModelManager } from '@accordproject/concerto-core';
import type { TemplateMarkDocument } from '@accordproject/ui-tiptap-template-editor';
import { TemplateEditor } from '@accordproject/ui-tiptap-template-editor';
import type { ValidationError } from '@accordproject/ui-tiptap-template-editor';
import { JsonPanel } from './components/JsonPanel';
import { ndaTemplate } from './fixtures/ndaTemplate';
import { serviceTemplate, serviceModel } from './fixtures/serviceTemplate';

export default function App() {
  const [doc, setDoc] = useState<TemplateMarkDocument>(ndaTemplate);
  const [modelManager, setModelManager] = useState<ModelManager | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'json' | 'concerto'>('concerto');

  const handleChange = useCallback((d: TemplateMarkDocument) => {
    setDoc(d);
  }, []);

  const handleValidation = useCallback((errors: ValidationError[]) => {
    setValidationErrors(errors);
  }, []);

  const loadTemplate = (template: TemplateMarkDocument, ctoModel?: string) => {
    setDoc({ ...template });
    if (ctoModel) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const mm = new ModelManager({ strict: false });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      mm.addCTOModel(ctoModel, 'model.cto', true);
      setModelManager(mm);
    } else {
      setModelManager(undefined);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <header style={headerStyle}>
        <span style={{ fontWeight: 700, fontSize: '15px', marginRight: 12 }}>
          Accord Project — Template Editor Demo
        </span>

        <button onClick={() => loadTemplate(ndaTemplate)} style={btnStyle(doc === ndaTemplate)}>
          NDA Template
        </button>
        <button onClick={() => loadTemplate(serviceTemplate, serviceModel)} style={btnStyle(doc === serviceTemplate)}>
          Services Agreement
        </button>

        <div style={{ flex: 1 }} />

        {validationErrors.length > 0 && (
          <span style={{ fontSize: 12, color: '#fc8181', marginRight: 12 }}>
            ⛔ {validationErrors.length} validation error{validationErrors.length > 1 ? 's' : ''}
          </span>
        )}
        {validationErrors.length === 0 && (
          <span style={{ fontSize: 12, color: '#68d391', marginRight: 12 }}>✓ Valid</span>
        )}
      </header>

      {/* ── Main layout ── */}
      <main style={mainStyle}>
        {/* Left: TemplateEditor (takes full height) */}
        <div style={{ ...panelWrapStyle, gridRow: '1 / 3' }}>
          <PanelShell title="Template Editor">
            <TemplateEditor
              value={doc}
              onChange={handleChange}
              onValidation={handleValidation}
              showValidation={true}
              showToolbar={true}
              className="demo-editor"
              placeholder="Start typing your template..."
              modelManager={modelManager}
            />
          </PanelShell>
        </div>

        <div style={panelWrapStyle}>
          <div style={tabbedContainerStyle}>
            <div style={tabBarStyle}>
              <button
                style={tabStyle(activeTab === 'json')}
                onClick={() => setActiveTab('json')}
              >
                TemplateMark JSON
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <JsonPanel value={doc} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={panelShellStyle}>
      <div style={panelHeaderStyle}>{title}</div>
      <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>{children}</div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const headerStyle: React.CSSProperties = {
  background: '#2d3748',
  color: '#fff',
  padding: '9px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
  flexWrap: 'wrap',
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  gap: 10,
  padding: 10,
  overflow: 'hidden',
  minHeight: 0,
};

const panelWrapStyle: React.CSSProperties = {
  overflow: 'hidden',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
};

const panelShellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};

const panelHeaderStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f7fafc',
  fontSize: 13,
  fontWeight: 600,
  color: '#4a5568',
  flexShrink: 0,
};

const tabbedContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};

const tabBarStyle: React.CSSProperties = {
  display: 'flex',
  background: '#f7fafc',
  borderBottom: '1px solid #e2e8f0',
  flexShrink: 0,
};

const tabStyle = (active: boolean): React.CSSProperties => ({
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

const btnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#4299e1' : '#4a5568',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '4px 12px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: active ? 600 : 400,
});

const codeStyle: React.CSSProperties = {
  background: '#2d3748',
  color: '#fbd38d',
  borderRadius: 3,
  padding: '1px 5px',
  fontSize: 11,
  fontFamily: 'monospace',
};
