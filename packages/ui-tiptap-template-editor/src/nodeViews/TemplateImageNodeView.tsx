import React, { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import ReactDOM from 'react-dom';
import { Popover, popoverClasses } from '../components/dialogs/Popover';
import '../styles/nodeview.css';

/**
 * NodeView for Image nodes with click-to-edit functionality.
 */
export const TemplateImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  selected,
}) => {
  const { src, alt, title } = node.attrs as {
    src?: string;
    alt?: string;
    title?: string;
  };
  const [editing, setEditing] = useState(false);
  const [draftSrc, setDraftSrc] = useState(src ?? '');
  const [draftAlt, setDraftAlt] = useState(alt ?? '');
  const [draftTitle, setDraftTitle] = useState(title ?? '');
  const anchorRef = useRef<HTMLSpanElement>(null);
  const isReadOnly = !editor.isEditable;

  const openEdit = useCallback((e: React.MouseEvent) => {
    if (isReadOnly) return;
    e.stopPropagation();
    setDraftSrc(src ?? '');
    setDraftAlt(alt ?? '');
    setDraftTitle(title ?? '');
    setEditing(true);
  }, [src, alt, title, isReadOnly]);

  const save = useCallback(() => {
    updateAttributes({
      src: draftSrc.trim() || null,
      alt: draftAlt.trim() || null,
      title: draftTitle.trim() || null,
    });
    setEditing(false);
  }, [draftSrc, draftAlt, draftTitle, updateAttributes]);

  const cancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  }, [save, cancel]);

  const popover = editing
    ? ReactDOM.createPortal(
        <Popover anchor={anchorRef.current} onClose={cancel} width={300}>
          <label className={popoverClasses.label}>Image URL</label>
          <input
            autoFocus
            value={draftSrc}
            onChange={(e) => setDraftSrc(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="https://example.com/image.png"
          />
          <label className={popoverClasses.label}>Alt Text</label>
          <input
            value={draftAlt}
            onChange={(e) => setDraftAlt(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="Description of image"
          />
          <label className={popoverClasses.label}>Title (tooltip)</label>
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className={popoverClasses.input}
            placeholder="Optional title"
          />
          <div className={popoverClasses.buttonRow}>
            <button onClick={save} className={popoverClasses.saveBtn}>Save</button>
            <button onClick={cancel} className={popoverClasses.cancelBtn}>Cancel</button>
          </div>
        </Popover>,
        document.body
      )
    : null;

  const wrapperClass = [
    'ap-image__wrapper',
    selected && 'ap-image__wrapper--selected',
    !isReadOnly && 'ap-image__wrapper--editable',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NodeViewWrapper as="span" className="ap-image">
      <span ref={anchorRef} onClick={openEdit} className={wrapperClass}>
        {src ? (
          <img
            src={src}
            alt={alt ?? ''}
            title={title ?? undefined}
            className="ap-image__img"
          />
        ) : (
          <span className="ap-image__placeholder">
            🖼️ No image URL
          </span>
        )}
      </span>
      {popover}
    </NodeViewWrapper>
  );
};
