import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

export const TemplateEnumVariableNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { name, enumValues } = node.attrs as { name: string; enumValues: string[]; value?: string };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftValues, setDraftValues] = useState((enumValues ?? []).join(', '));
  const anchorRef = useRef<HTMLSpanElement>(null);

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setDraftValues((enumValues ?? []).join(', '));
    setEditing(true);
  }, [name, enumValues]);

  const save = useCallback(() => {
    if (!draftName.trim()) { setEditing(false); return; }
    const parsed = draftValues.split(',').map((v) => v.trim()).filter(Boolean);
    updateAttributes({
      name: draftName.trim(),
      enumValues: parsed,
      value: parsed[0] ?? '',
    });
    setEditing(false);
  }, [draftName, draftValues, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const display = (enumValues ?? []).join(' | ');

  const popover = editing && ReactDOM.createPortal(
    <Popover anchor={anchorRef.current} onClose={cancel} width={240}>
      <label className={popoverClasses.label}>Name</label>
      <input
        autoFocus
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onKeyDown={handleKeyDown}
        className={popoverClasses.input}
        placeholder="variable name"
      />
      <label className={popoverClasses.label}>Enum values (comma-separated)</label>
      <input
        value={draftValues}
        onChange={(e) => setDraftValues(e.target.value)}
        onKeyDown={handleKeyDown}
        className={popoverClasses.input}
        placeholder="e.g. California, New York, Delaware"
      />
      <div className={popoverClasses.buttonRow}>
        <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
        <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
      </div>
    </Popover>,
    document.body
  );

  return (
    <NodeViewWrapper as="span">
      <span
        ref={anchorRef}
        onClick={openEdit}
        contentEditable={false}
        className="ap-badge ap-badge--enum"
        title={`Enum variable: ${name} — click to edit`}
      >
        {'{{ '}{name}{' : ['}<em className="ap-badge__type">{display || '…'}</em>{'] }}'}
      </span>
      {popover}
    </NodeViewWrapper>
  );
};
