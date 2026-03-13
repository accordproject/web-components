import React, { useEffect, useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import type { TemplateEditorProps } from '../types';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import { useMarkdownSync } from '../hooks/useMarkdownSync';
import { useValidation } from '../hooks/useValidation';
import { Toolbar } from './Toolbar';
import { MarkdownEditor } from './MarkdownEditor';
import { ValidationPanel } from './ValidationPanel';
import '../styles/editor.css';

export const TemplateEditor: React.FC<TemplateEditorProps> = (props) => {
  const { editor, nameRef, currentDoc } = useTemplateEditor(props);
  const { view, markdownText, setMarkdownText, toggleView } = useMarkdownSync(editor, nameRef, props.modelManager);
  const showValidation = props.showValidation ?? true;
  const errors = useValidation(currentDoc.current, showValidation, props.onValidation, props.modelManager);

  // Ctrl+M keyboard shortcut to toggle view
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleView();
      }
    },
    [toggleView]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const theme = props.theme ?? 'light';

  return (
    <div 
      className={`ap-template-editor ${props.className ?? ''}`}
      data-theme={theme}
    >
      {(props.showToolbar ?? true) && (
        <Toolbar
          editor={editor}
          view={view}
          onToggleView={toggleView}
          showMarkdownToggle={props.showMarkdownToggle ?? true}
        />
      )}
      <div className="ap-template-editor__body">
        {view === 'rich' ? (
          <EditorContent
            editor={editor}
            className="ap-template-editor__content"
          />
        ) : (
          <MarkdownEditor
            value={markdownText}
            onChange={setMarkdownText}
            placeholder={props.placeholder}
          />
        )}
      </div>
      {showValidation && errors.length > 0 && <ValidationPanel errors={errors} />}
    </div>
  );
};
