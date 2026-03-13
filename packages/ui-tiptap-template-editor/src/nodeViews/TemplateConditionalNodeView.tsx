import React, { useState, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { branchToMarkdown, markdownToBranch, branchPreview } from '../utils/branchMarkdown';

export const TemplateConditionalNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { name, whenTrueJson, whenFalseJson } = node.attrs as {
    name: string;
    whenTrueJson: string;
    whenFalseJson: string;
  };
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (trueMd: string, falseMd: string) => {
      updateAttributes({
        whenTrueJson: markdownToBranch(trueMd),
        whenFalseJson: markdownToBranch(falseMd),
      });
      setModalOpen(false);
    },
    [updateAttributes]
  );

  const truePreview = branchPreview(whenTrueJson || '[]');
  const falsePreview = branchPreview(whenFalseJson || '[]');

  return (
    <NodeViewWrapper as="span">
      <span contentEditable={false} style={wrapStyle}>
        <span style={pillStyle('#bee3f8', '#2a4365', '#63b3ed')}>
          <span style={labelStyle}>if: </span>
          <strong>{name}</strong>
        </span>
        <span style={branchStyle('#ebf8ff')}>
          <span style={branchLabel}>true</span>
          <span style={previewStyle}>{truePreview || '(empty)'}</span>
        </span>
        <span style={dividerStyle}>|</span>
        <span style={branchStyle('#fff5f5')}>
          <span style={branchLabel}>false</span>
          <span style={previewStyle}>{falsePreview || '(empty)'}</span>
        </span>
        <button
          onClick={openModal}
          contentEditable={false}
          style={editBtnStyle}
          title="Edit branches"
        >
          ✏ Edit
        </button>
      </span>
      {modalOpen &&
        ReactDOM.createPortal(
          <BranchModal
            title={`Edit conditional: ${name}`}
            branches={[
              { label: 'True branch (if)', initialMd: branchToMarkdown(whenTrueJson || '[]') },
              { label: 'False branch (else)', initialMd: branchToMarkdown(whenFalseJson || '[]') },
            ]}
            onSave={([trueMd, falseMd]) => handleSave(trueMd, falseMd)}
            onClose={() => setModalOpen(false)}
          />,
          document.body
        )}
    </NodeViewWrapper>
  );
};

// ── BranchModal ───────────────────────────────────────────────────────────────

interface BranchConfig {
  label: string;
  initialMd: string;
}

interface BranchModalProps {
  title: string;
  branches: BranchConfig[];
  onSave: (values: string[]) => void;
  onClose: () => void;
}

function BranchModal({ title, branches, onSave, onClose }: BranchModalProps) {
  const [values, setValues] = useState<string[]>(branches.map((b) => b.initialMd));

  const handleSave = useCallback(() => onSave(values), [onSave, values]);

  const update = (i: number, v: string) =>
    setValues((prev) => prev.map((x, j) => (j === i ? v : x)));

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>
        <div style={modalBodyStyle}>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#718096' }}>
            Edit each branch as TemplateMark markdown. Use <code>{'{{varName}}'}</code> for variables.
          </p>
          {branches.map((b, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={modalLabelStyle}>{b.label}</label>
              <textarea
                value={values[i]}
                onChange={(e) => update(i, e.target.value)}
                style={textareaStyle}
                spellCheck={false}
                rows={5}
              />
            </div>
          ))}
        </div>
        <div style={modalFooterStyle}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleSave} style={saveBtnStyle}>Save branches</button>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const wrapStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  border: '1px solid #63b3ed',
  borderRadius: 4,
  padding: '1px 4px',
  background: '#ebf8ff',
  verticalAlign: 'middle',
};

const pillStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 3,
  padding: '0 4px',
  color,
  fontSize: 12,
  whiteSpace: 'nowrap',
});

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  opacity: 0.7,
};

const branchStyle = (bg: string): React.CSSProperties => ({
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

const branchLabel: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  fontWeight: 600,
  opacity: 0.6,
  flexShrink: 0,
};

const previewStyle: React.CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: '#4a5568',
};

const dividerStyle: React.CSSProperties = {
  color: '#a0aec0',
  fontSize: 12,
};

const editBtnStyle: React.CSSProperties = {
  background: '#ebf4ff',
  border: '1px solid #90cdf4',
  borderRadius: 3,
  padding: '0 6px',
  fontSize: 11,
  cursor: 'pointer',
  color: '#2b6cb0',
  flexShrink: 0,
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
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

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid #e2e8f0',
  flexShrink: 0,
};

const modalBodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
};

const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '12px 16px',
  borderTop: '1px solid #e2e8f0',
  flexShrink: 0,
};

const modalLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#4a5568',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const textareaStyle: React.CSSProperties = {
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

const saveBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  background: '#3182ce',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  background: '#e2e8f0',
  color: '#4a5568',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 13,
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 16,
  cursor: 'pointer',
  color: '#718096',
  lineHeight: 1,
  padding: '2px 4px',
};
