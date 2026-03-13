import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

/**
 * NodeView for OptionalBlockDefinition blocks.
 * Block-level optional with two editable branches (whenSome/whenNone).
 */
export const TemplateOptionalBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  deleteNode,
}) => {
  const { name } = node.attrs as {
    name: string;
  };
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [activeTab, setActiveTab] = useState<'some' | 'none'>('some');
  const anchorRef = useRef<HTMLDivElement>(null);
  const isReadOnly = !editor.isEditable;

  const openEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftName(name);
    setEditing(true);
  }, [name]);

  const save = useCallback(() => {
    updateAttributes({
      name: draftName.trim() || 'optional',
    });
    setEditing(false);
  }, [draftName, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this optional block?')) {
      deleteNode();
    }
  }, [deleteNode]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={260}>
          <label className={popoverClasses.label}>Optional Variable</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="variable name"
          />
          <div className={popoverClasses.buttonRow}>
            <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
            <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
          </div>
        </Popover>,
        document.body
      )
    : null;

  const getSomeTabClasses = () => {
    const base = 'ap-block__tab ap-block__tab--true';
    return activeTab === 'some' ? `${base} ap-block__tab--active` : base;
  };

  const getNoneTabClasses = () => {
    const base = 'ap-block__tab ap-block__tab--false';
    return activeTab === 'none' ? `${base} ap-block__tab--active` : base;
  };

  return (
    <NodeViewWrapper as="div" className="ap-block ap-block--optional">
      <div ref={anchorRef} className="ap-block__header" contentEditable={false}>
        <div className="ap-block__header-left">
          <span className="ap-block__icon">◻</span>
          <strong>optional:</strong>
          <code className="ap-block__code">{name || 'variable'}</code>
        </div>
        {!isReadOnly && (
          <div className="ap-block__actions">
            <button onClick={openEdit} className="ap-block__btn" title="Edit optional variable">
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
          onClick={() => setActiveTab('some')}
          className={getSomeTabClasses()}
        >
          ✓ When present
        </button>
        <button
          onClick={() => setActiveTab('none')}
          className={getNoneTabClasses()}
        >
          ∅ When absent
        </button>
      </div>

      {/* Branch content */}
      <div className="ap-block__branch">
        <NodeViewContent className="ap-block__content" />
      </div>
      {popover}
    </NodeViewWrapper>
  );
};


