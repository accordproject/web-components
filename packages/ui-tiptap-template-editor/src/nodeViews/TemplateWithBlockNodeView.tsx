import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

/**
 * NodeView for WithBlockDefinition blocks.
 * Block-level scoping context.
 */
export const TemplateWithBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  deleteNode,
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
      name: draftName.trim() || 'scope',
      elementType: draftElementType.trim() || null,
    });
    setEditing(false);
  }, [draftName, draftElementType, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this with block?')) {
      deleteNode();
    }
  }, [deleteNode]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={260}>
          <label className={popoverClasses.label}>Scope Variable</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="variable name"
          />
          <label className={popoverClasses.label}>Element Type</label>
          <input
            value={draftElementType}
            onChange={(e) => setDraftElementType(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="org.example.MyType (optional)"
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
    <NodeViewWrapper as="div" className="ap-block ap-block--with">
      <div ref={anchorRef} className="ap-block__header" contentEditable={false}>
        <div className="ap-block__header-left">
          <span className="ap-block__icon">🔗</span>
          <strong>with:</strong>
          <code className="ap-block__code">{name || 'variable'}</code>
          {elementType && <span className="ap-block__condition">{elementType}</span>}
        </div>
        {!isReadOnly && (
          <div className="ap-block__actions">
            <button onClick={openEdit} className="ap-block__btn" title="Edit scope">
              ✏️
            </button>
            <button onClick={handleDelete} className="ap-block__btn ap-block__btn--danger" title="Delete">
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


