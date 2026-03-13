import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

/**
 * NodeView for ConditionalBlockDefinition blocks.
 * Block-level conditional with two editable branches (whenTrue/whenFalse).
 */
export const TemplateConditionalBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  deleteNode,
}) => {
  const { name, condition } = node.attrs as {
    name: string;
    condition?: { type: string; contents: string } | null;
  };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftCondition, setDraftCondition] = useState(condition?.contents ?? '');
  const [activeTab, setActiveTab] = useState<'true' | 'false'>('true');
  const anchorRef = useRef<HTMLDivElement>(null);
  const isReadOnly = !editor.isEditable;

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setDraftCondition(condition?.contents ?? '');
    setEditing(true);
  }, [name, condition]);

  const save = useCallback(() => {
    updateAttributes({
      name: draftName.trim() || 'condition',
      condition: draftCondition.trim()
        ? { type: 'ES_2020', contents: draftCondition.trim() }
        : null,
    });
    setEditing(false);
  }, [draftName, draftCondition, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this conditional block?')) {
      deleteNode();
    }
  }, [deleteNode]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={300}>
          <label className={popoverClasses.label}>Condition Variable</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="variable name"
          />
          <label className={popoverClasses.label}>Condition Expression (optional)</label>
          <textarea
            value={draftCondition}
            onChange={(e) => setDraftCondition(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.textarea}
            placeholder="e.g., value > 100"
            rows={2}
          />
          <div className={popoverClasses.buttonRow}>
            <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
            <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
          </div>
        </Popover>,
        document.body
      )
    : null;

  const getTrueTabClasses = () => {
    const base = 'ap-block__tab ap-block__tab--true';
    return activeTab === 'true' ? `${base} ap-block__tab--active` : base;
  };

  const getFalseTabClasses = () => {
    const base = 'ap-block__tab ap-block__tab--false';
    return activeTab === 'false' ? `${base} ap-block__tab--active` : base;
  };

  return (
    <NodeViewWrapper as="div" className="ap-block ap-block--conditional">
      <div ref={anchorRef} className="ap-block__header" contentEditable={false}>
        <div className="ap-block__header-left">
          <span className="ap-block__icon">❓</span>
          <strong>if:</strong>
          <code className="ap-block__code">{name || 'condition'}</code>
          {condition?.contents && (
            <span className="ap-block__condition">({condition.contents})</span>
          )}
        </div>
        {!isReadOnly && (
          <div className="ap-block__actions">
            <button onClick={openEdit} className="ap-block__btn" title="Edit condition">
              ✏️
            </button>
            <button onClick={handleDelete} className="ap-block__btn ap-block__btn--danger" title="Delete">
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Tab bar for branches */}
      <div className="ap-block__tabs" contentEditable={false}>
        <button
          onClick={() => setActiveTab('true')}
          className={getTrueTabClasses()}
        >
          ✓ True branch
        </button>
        <button
          onClick={() => setActiveTab('false')}
          className={getFalseTabClasses()}
        >
          ✗ False branch
        </button>
      </div>

      {/* Branch content - using NodeViewContent displays all content */}
      <div className="ap-block__branch">
        <NodeViewContent className="ap-block__content" />
      </div>
      {popover}
    </NodeViewWrapper>
  );
};


