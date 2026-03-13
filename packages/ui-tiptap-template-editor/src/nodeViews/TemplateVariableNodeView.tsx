import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import {
  PRIMITIVE_TYPES,
  ACCORD_PROJECT_TYPES,
  getFriendlyTypeName,
  getFullTypeName,
  getBadgeModifier,
} from '../constants/types';
import '../styles/nodeview.css';

export const TemplateVariableNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const { name, elementType } = node.attrs as { name: string; elementType?: string };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftType, setDraftType] = useState(elementType ?? 'String');
  const anchorRef = useRef<HTMLSpanElement>(null);

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setDraftType(elementType ?? 'String');
    setEditing(true);
  }, [name, elementType]);

  const save = useCallback(() => {
    if (draftName.trim()) {
      updateAttributes({ name: draftName.trim(), elementType: getFullTypeName(draftType) });
    }
    setEditing(false);
  }, [draftName, draftType, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const popover = editing ? ReactDOM.createPortal(
    <Popover anchor={anchorRef.current} onClose={cancel}>
      <label className={popoverClasses.label}>Name</label>
      <input
        autoFocus
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onKeyDown={handleKeyDown}
        className={popoverClasses.input}
        placeholder="variable name"
      />
      <label className={popoverClasses.label}>Type</label>
      <select
        value={getFriendlyTypeName(draftType)}
        onChange={(e) => setDraftType(e.target.value)}
        className={popoverClasses.select}
      >
        <optgroup label="Primitives">
          {PRIMITIVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </optgroup>
        <optgroup label="Accord Project">
          {Object.keys(ACCORD_PROJECT_TYPES).map((t) => <option key={t} value={t}>{t}</option>)}
        </optgroup>
      </select>
      <div className={popoverClasses.buttonRow}>
        <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
        <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
      </div>
    </Popover>,
    document.body
  ) : null;

  const badgeClass = `ap-badge ap-badge--${getBadgeModifier(elementType)}`;
  const friendlyType = getFriendlyTypeName(elementType ?? 'String');

  return (
    <NodeViewWrapper as="span">
      <span
        ref={anchorRef}
        onClick={openEdit}
        contentEditable={false}
        className={badgeClass}
        title={`Variable: ${name} (${friendlyType}) — click to edit`}
      >
        {'{{ '}{name}{' : '}<em className="ap-badge__type">{friendlyType}</em>{' }}'}
      </span>
      {popover}
    </NodeViewWrapper>
  );
};

// ── TemplateFormattedVariableNodeView ─────────────────────────────────────────

export const TemplateFormattedVariableNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { name, elementType, format } = node.attrs as {
    name: string;
    elementType?: string;
    format?: string;
  };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftType, setDraftType] = useState(elementType ?? 'DateTime');
  const [draftFormat, setDraftFormat] = useState(format ?? '');
  const anchorRef = useRef<HTMLSpanElement>(null);

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name); setDraftType(elementType ?? 'DateTime'); setDraftFormat(format ?? '');
    setEditing(true);
  }, [name, elementType, format]);

  const save = useCallback(() => {
    if (draftName.trim()) {
      updateAttributes({ name: draftName.trim(), elementType: getFullTypeName(draftType), format: draftFormat.trim() || undefined });
    }
    setEditing(false);
  }, [draftName, draftType, draftFormat, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const popover = editing ? ReactDOM.createPortal(
    <Popover anchor={anchorRef.current} onClose={cancel}>
      <label className={popoverClasses.label}>Name</label>
      <input autoFocus value={draftName} onChange={(e) => setDraftName(e.target.value)} onKeyDown={handleKeyDown} className={popoverClasses.input} />
      <label className={popoverClasses.label}>Type</label>
      <select value={getFriendlyTypeName(draftType)} onChange={(e) => setDraftType(e.target.value)} className={popoverClasses.select}>
        <optgroup label="Primitives">
          {PRIMITIVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </optgroup>
        <optgroup label="Accord Project">
          {Object.keys(ACCORD_PROJECT_TYPES).map((t) => <option key={t} value={t}>{t}</option>)}
        </optgroup>
      </select>
      <label className={popoverClasses.label}>Format</label>
      <input value={draftFormat} onChange={(e) => setDraftFormat(e.target.value)} onKeyDown={handleKeyDown} className={popoverClasses.input} placeholder="e.g. YYYY-MM-DD or 0,0.00 CCC" />
      <div className={popoverClasses.buttonRow}>
        <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
        <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
      </div>
    </Popover>,
    document.body
  ) : null;

  const friendlyType = getFriendlyTypeName(elementType ?? 'DateTime');

  return (
    <NodeViewWrapper as="span">
      <span
        ref={anchorRef}
        onClick={openEdit}
        contentEditable={false}
        className="ap-badge ap-badge--formatted"
        title={`Formatted variable: ${name} (${friendlyType}${format ? ' | ' + format : ''}) — click to edit`}
      >
        {'{{ '}{name}{' : '}<em className="ap-badge__type">{friendlyType}</em>
        {format && <span className="ap-badge__format">{' | '}{format}</span>}
        {' }}'}
      </span>
      {popover}
    </NodeViewWrapper>
  );
};
