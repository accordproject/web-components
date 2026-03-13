import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import type { ClauseExtensionOptions } from '../extensions/ClauseExtension';
import '../styles/nodeview.css';

interface TemplateClauseNodeViewProps extends NodeViewProps {
  clauseOptions?: ClauseExtensionOptions;
}

/**
 * NodeView for ClauseDefinition blocks.
 * Displays clause with header, edit functionality, and nested content.
 */
export const TemplateClauseNodeView: React.FC<TemplateClauseNodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  deleteNode,
  clauseOptions,
}) => {
  const { name, src, elementType, condition, error } = node.attrs as {
    name: string;
    src?: string;
    elementType?: string;
    condition?: { type: string; contents: string } | null;
    error?: string;
  };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftSrc, setDraftSrc] = useState(src ?? '');
  const [draftElementType, setDraftElementType] = useState(elementType ?? '');
  const anchorRef = useRef<HTMLDivElement>(null);
  const isReadOnly = !editor.isEditable;

  const displayName = src ? src.split('@')[0].split('/').pop() ?? name : name || 'Unnamed Clause';

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setDraftSrc(src ?? '');
    setDraftElementType(elementType ?? '');
    setEditing(true);
  }, [name, src, elementType]);

  const save = useCallback(() => {
    updateAttributes({
      name: draftName.trim() || 'clause',
      src: draftSrc.trim() || null,
      elementType: draftElementType.trim() || null,
    });
    setEditing(false);
  }, [draftName, draftSrc, draftElementType, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this clause?')) {
      deleteNode();
    }
  }, [deleteNode]);

  const handleExternalEdit = useCallback(() => {
    if (src && clauseOptions?.onClauseEdit) {
      clauseOptions.onClauseEdit(src);
    }
  }, [src, clauseOptions]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={280}>
          <label className={popoverClasses.label}>Clause Name</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="clause name"
          />
          <label className={popoverClasses.label}>Source (URL)</label>
          <input
            value={draftSrc}
            onChange={(e) => setDraftSrc(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="https://... (optional)"
          />
          <label className={popoverClasses.label}>Element Type</label>
          <input
            value={draftElementType}
            onChange={(e) => setDraftElementType(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="org.example.MyClause (optional)"
          />
          <div className={popoverClasses.buttonRow}>
            <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
            <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
          </div>
        </Popover>,
        document.body
      )
    : null;

  const wrapperClasses = `ap-block ap-block--clause${error ? ' ap-block--error' : ''}`;

  return (
    <NodeViewWrapper as="div" className={wrapperClasses}>
      <div ref={anchorRef} className="ap-block__header" contentEditable={false}>
        <div className="ap-block__header-left">
          <span className="ap-block__icon">📋</span>
          <strong>Clause:</strong>
          <span className="ap-block__name">{displayName}</span>
          {error && <span className="ap-block__error">⚠ {error}</span>}
        </div>
        {!isReadOnly && (
          <div className="ap-block__actions">
            <button onClick={openEdit} className="ap-block__btn" title="Edit clause metadata">
              ✏️
            </button>
            {src && clauseOptions?.onClauseEdit && (
              <button onClick={handleExternalEdit} className="ap-block__btn" title="Open clause source">
                🔗
              </button>
            )}
            <button onClick={handleDelete} className="ap-block__btn ap-block__btn--danger" title="Delete clause">
              🗑️
            </button>
          </div>
        )}
      </div>
      <NodeViewContent className="ap-block__content" />
      {popover}
    </NodeViewWrapper>
  );
};


