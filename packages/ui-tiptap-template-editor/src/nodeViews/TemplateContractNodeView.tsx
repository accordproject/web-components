import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

/**
 * NodeView for ContractDefinition blocks.
 * Displays contract document wrapper with metadata header.
 */
export const TemplateContractNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
}) => {
  const { name, elementType } = node.attrs as {
    name: string;
    elementType?: string;
  };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftElementType, setDraftElementType] = useState(elementType ?? '');
  const anchorRef = useRef<HTMLDivElement>(null);
  const isReadOnly = !editor.isEditable;

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setDraftElementType(elementType ?? '');
    setEditing(true);
  }, [name, elementType]);

  const save = useCallback(() => {
    updateAttributes({
      name: draftName.trim() || 'contract',
      elementType: draftElementType.trim() || null,
    });
    setEditing(false);
  }, [draftName, draftElementType, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={280}>
          <label className={popoverClasses.label}>Contract Name</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="contract name"
          />
          <label className={popoverClasses.label}>Element Type</label>
          <input
            value={draftElementType}
            onChange={(e) => setDraftElementType(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="org.example.MyContract (optional)"
          />
          <div className={popoverClasses.buttonRow}>
            <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
            <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
          </div>
        </Popover>,
        document.body
      )
    : null;

  return (
    <NodeViewWrapper as="div" className="ap-block ap-block--clause">
      <div ref={anchorRef} className="ap-block__header" contentEditable={false}>
        <div className="ap-block__header-left">
          <span className="ap-block__icon">📄</span>
          <strong>Contract:</strong>
          <span className="ap-block__name">{name || 'Unnamed Contract'}</span>
        </div>
        {!isReadOnly && (
          <button onClick={openEdit} className="ap-block__btn" title="Edit contract metadata">
            ✏️
          </button>
        )}
      </div>
      <NodeViewContent className="ap-block__content" />
      {popover}
    </NodeViewWrapper>
  );
};


