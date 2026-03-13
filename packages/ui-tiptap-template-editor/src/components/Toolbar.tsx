import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Editor } from '@tiptap/core';
import { InsertDialog, type InsertFieldConfig } from './dialogs/Modal';
import { PRIMITIVE_TYPES, ACCORD_PROJECT_TYPES, getFullTypeName } from '../constants/types';
import '../styles/toolbar.css';

interface ToolbarProps {
  editor: Editor | null;
  view: 'rich' | 'markdown';
  onToggleView: () => void;
  showMarkdownToggle?: boolean;
}

// ── Dropdown menu component ────────────────────────────────────────────────────

interface DropdownItem {
  id: string;
  label: string;
  icon: string;
  title: string;
}

interface DropdownMenuProps {
  label: string;
  icon: string;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, icon, items, onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="ap-toolbar-dropdown" ref={ref}>
      <button
        className={`ap-template-editor__toolbar-btn ap-toolbar-dropdown__trigger ${open ? 'ap-toolbar-dropdown__trigger--open' : ''}`}
        onClick={() => setOpen(!open)}
        disabled={disabled}
        title={label}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {icon} {label} <span className="ap-toolbar-dropdown__caret">▾</span>
      </button>
      {open && (
        <div className="ap-toolbar-dropdown__menu" role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              className="ap-toolbar-dropdown__item"
              onClick={() => { onSelect(item.id); setOpen(false); }}
              title={item.title}
              role="menuitem"
            >
              <span className="ap-toolbar-dropdown__item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Dialog field configs ───────────────────────────────────────────────────────

const ALL_TYPE_OPTIONS = [...PRIMITIVE_TYPES, ...Object.keys(ACCORD_PROJECT_TYPES)];

const NAME_FIELD = (placeholder: string): InsertFieldConfig => ({
  name: 'name',
  label: 'Variable Name',
  type: 'text',
  required: true,
  placeholder,
});

interface DialogConfig {
  title: string;
  fields: InsertFieldConfig[];
}

const DIALOG_CONFIGS: Record<string, DialogConfig> = {
  variable: {
    title: 'Insert Variable',
    fields: [
      { name: 'name', label: 'Variable Name', type: 'text', required: true, placeholder: 'e.g. partyName' },
      { name: 'elementType', label: 'Type', type: 'select', options: ALL_TYPE_OPTIONS, defaultValue: 'String' },
    ],
  },
  formula: {
    title: 'Insert Formula',
    fields: [
      { name: 'name', label: 'Formula Name', type: 'text', required: true, placeholder: 'e.g. totalAmount' },
      { name: 'elementType', label: 'Return Type', type: 'select', options: [...PRIMITIVE_TYPES], defaultValue: 'Double' },
    ],
  },
  enum: {
    title: 'Insert Enum Variable',
    fields: [
      { name: 'name', label: 'Variable Name', type: 'text', required: true, placeholder: 'e.g. jurisdiction' },
      { name: 'enumValues', label: 'Values (comma-separated)', type: 'text', required: true, placeholder: 'option1, option2, option3', defaultValue: 'option1,option2' },
    ],
  },
  conditional: {
    title: 'Insert Conditional (inline)',
    fields: [NAME_FIELD('e.g. isMutual')],
  },
  optional: {
    title: 'Insert Optional (inline)',
    fields: [NAME_FIELD('e.g. arbitration')],
  },
  conditionalBlock: {
    title: 'Insert Conditional Block',
    fields: [NAME_FIELD('e.g. showSection')],
  },
  optionalBlock: {
    title: 'Insert Optional Block',
    fields: [NAME_FIELD('e.g. bonusClause')],
  },
  withBlock: {
    title: 'Insert With Block',
    fields: [{ ...NAME_FIELD('e.g. partyDetails'), label: 'Scope Variable Name' }],
  },
  listBullet: {
    title: 'Insert Bullet List (loop)',
    fields: [{ ...NAME_FIELD('e.g. items'), label: 'Array Variable Name' }],
  },
  listOrdered: {
    title: 'Insert Ordered List (loop)',
    fields: [{ ...NAME_FIELD('e.g. items'), label: 'Array Variable Name' }],
  },
  clause: {
    title: 'Insert Clause',
    fields: [
      { name: 'name', label: 'Clause Name', type: 'text', required: true, placeholder: 'e.g., payment-terms' },
      { name: 'src', label: 'Source URL', type: 'text', placeholder: 'https://... (optional)' },
      { name: 'elementType', label: 'Element Type', type: 'text', placeholder: 'org.example.MyClause (optional)' },
    ],
  },
  contract: {
    title: 'Insert Contract',
    fields: [
      { name: 'name', label: 'Contract Name', type: 'text', required: true, placeholder: 'e.g., service-agreement' },
      { name: 'elementType', label: 'Element Type', type: 'text', placeholder: 'org.example.MyContract (optional)' },
    ],
  },
  image: {
    title: 'Insert Image',
    fields: [
      { name: 'src', label: 'Image URL', type: 'text', required: true, placeholder: 'https://example.com/image.png' },
      { name: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Description of image' },
      { name: 'title', label: 'Title (tooltip)', type: 'text', placeholder: 'Optional title' },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Toolbar: React.FC<ToolbarProps> = ({ editor, view, onToggleView, showMarkdownToggle = true }) => {
  const [dialogType, setDialogType] = useState<string | null>(null);

  const handleInsert = useCallback((values: Record<string, string>) => {
    if (!editor || !dialogType) return;

    switch (dialogType) {
      case 'variable':
        editor.chain().focus().insertContent({
          type: 'variable',
          attrs: { name: values.name, elementType: getFullTypeName(values.elementType) || 'String', decorators: [] },
          content: [{ type: 'text', text: values.name }],
        }).run();
        break;

      case 'formula':
        editor.chain().focus().insertContent({
          type: 'formula',
          attrs: { name: values.name, elementType: values.elementType || 'Double', codeContents: '', dependencies: [], value: '' },
        }).run();
        break;

      case 'enum': {
        const enumValues = values.enumValues.split(',').map((v) => v.trim()).filter(Boolean);
        if (enumValues.length === 0) return;
        editor.chain().focus().insertContent({
          type: 'enumVariable',
          attrs: { name: values.name, enumValues, value: enumValues[0], elementType: 'String' },
        }).run();
        break;
      }

      case 'conditional':
        editor.chain().focus().insertContent({
          type: 'conditional',
          attrs: { name: values.name, isTrue: false, whenTrueJson: JSON.stringify([]), whenFalseJson: JSON.stringify([]) },
        }).run();
        break;

      case 'optional':
        editor.chain().focus().insertContent({
          type: 'optional',
          attrs: { name: values.name, hasSome: false, whenSomeJson: JSON.stringify([]), whenNoneJson: JSON.stringify([]) },
        }).run();
        break;

      case 'conditionalBlock':
        editor.chain().focus().insertContent({
          type: 'conditionalBlock',
          attrs: { name: values.name, condition: null },
          content: [
            { type: 'conditionalBranchTrue', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Content when true...' }] }] },
            { type: 'conditionalBranchFalse', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Content when false...' }] }] },
          ],
        }).run();
        break;

      case 'optionalBlock':
        editor.chain().focus().insertContent({
          type: 'optionalBlock',
          attrs: { name: values.name },
          content: [
            { type: 'optionalBranchSome', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Content when present...' }] }] },
            { type: 'optionalBranchNone', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Content when absent...' }] }] },
          ],
        }).run();
        break;

      case 'withBlock':
        editor.chain().focus().insertContent({
          type: 'withBlockDef',
          attrs: { name: values.name, elementType: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Scoped content...' }] }],
        }).run();
        break;

      case 'listBullet':
        editor.chain().focus().insertContent({
          type: 'listBlock',
          attrs: { name: values.name, listType: 'bullet', tight: true, start: 1, elementType: null, delimiter: null },
          content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item content...' }] }] }],
        }).run();
        break;

      case 'listOrdered':
        editor.chain().focus().insertContent({
          type: 'listBlock',
          attrs: { name: values.name, listType: 'ordered', tight: true, start: 1, elementType: null, delimiter: null },
          content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item content...' }] }] }],
        }).run();
        break;

      case 'clause':
        editor.chain().focus().insertContent({
          type: 'clause',
          attrs: { name: values.name || 'clause', src: values.src || null, elementType: values.elementType || null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Clause content...' }] }],
        }).run();
        break;

      case 'contract':
        editor.chain().focus().insertContent({
          type: 'contract',
          attrs: { name: values.name || 'contract', elementType: values.elementType || null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contract content...' }] }],
        }).run();
        break;

      case 'image':
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: values.src || null, alt: values.alt || null, title: values.title || null },
        }).run();
        break;
    }
  }, [editor, dialogType]);

  const insertHorizontalRule = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const disabled = !editor || view === 'markdown';
  const activeConfig = dialogType ? DIALOG_CONFIGS[dialogType] : null;

  // Dropdown menu items
  const variableItems: DropdownItem[] = [
    { id: 'variable', label: 'Variable', icon: '¶', title: 'Insert a variable placeholder' },
    { id: 'enum', label: 'Enum', icon: '≡', title: 'Insert an enum variable with options' },
    { id: 'formula', label: 'Formula', icon: 'ƒ', title: 'Insert a computed formula' },
  ];

  const logicItems: DropdownItem[] = [
    { id: 'conditional', label: 'If (inline)', icon: '?', title: 'Insert inline conditional' },
    { id: 'optional', label: 'Optional (inline)', icon: '◯', title: 'Insert inline optional' },
    { id: 'conditionalBlock', label: 'If Block', icon: '❓', title: 'Insert conditional block with true/false branches' },
    { id: 'optionalBlock', label: 'Optional Block', icon: '◻', title: 'Insert optional block with some/none branches' },
    { id: 'withBlock', label: 'With Block', icon: '🔗', title: 'Insert scoped with block' },
  ];

  const listItems: DropdownItem[] = [
    { id: 'listBullet', label: 'Template Bullet List', icon: '•', title: 'Insert bullet list loop (ulist)' },
    { id: 'listOrdered', label: 'Template Ordered List', icon: '1.', title: 'Insert ordered list loop (olist)' },
  ];

  const structureItems: DropdownItem[] = [
    { id: 'clause', label: 'Clause', icon: '📋', title: 'Insert a clause block' },
    { id: 'contract', label: 'Contract', icon: '📄', title: 'Insert a contract wrapper' },
  ];

  return (
    <div className="ap-template-editor__toolbar" role="toolbar" aria-label="Template editor toolbar">
      {/* Primary actions - always visible */}
      <div className="ap-template-editor__toolbar-group ap-template-editor__toolbar-group--primary">
        <button 
          className="ap-template-editor__toolbar-btn" 
          onClick={() => setDialogType('variable')} 
          disabled={disabled} 
          title="Insert variable"
        >
          <span className="ap-toolbar-icon">¶</span>
          <span className="ap-toolbar-label">Variable</span>
        </button>
        <button 
          className="ap-template-editor__toolbar-btn" 
          onClick={() => setDialogType('formula')} 
          disabled={disabled} 
          title="Insert formula"
        >
          <span className="ap-toolbar-icon">ƒ</span>
          <span className="ap-toolbar-label">Formula</span>
        </button>
      </div>

      <div className="ap-template-editor__toolbar-separator" />

      {/* Template elements - dropdowns */}
      <div className="ap-template-editor__toolbar-group">
        <DropdownMenu
          label="Data"
          icon="⚙"
          items={[
            { id: 'enum', label: 'Enum Variable', icon: '≡', title: 'Insert enum with options' },
          ]}
          onSelect={setDialogType}
          disabled={disabled}
        />
        <DropdownMenu
          label="Logic"
          icon="⚡"
          items={logicItems}
          onSelect={setDialogType}
          disabled={disabled}
        />
        <DropdownMenu
          label="Structure"
          icon="📦"
          items={[...structureItems, ...listItems]}
          onSelect={setDialogType}
          disabled={disabled}
        />
      </div>

      <div className="ap-template-editor__toolbar-separator" />

      {/* Formatting - compact */}
      <div className="ap-template-editor__toolbar-group">
        <button 
          className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('bold') ? 'ap-template-editor__toolbar-btn--active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          disabled={disabled} 
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button 
          className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('italic') ? 'ap-template-editor__toolbar-btn--active' : ''}`}
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          disabled={disabled} 
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <div className="ap-toolbar-btn-group">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('heading', { level }) ? 'ap-template-editor__toolbar-btn--active' : ''}`}
              onClick={() => editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
              disabled={disabled}
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}
        </div>
      </div>

      <div className="ap-template-editor__toolbar-separator" />

      {/* Lists */}
      <div className="ap-template-editor__toolbar-group">
        <button 
          className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('bulletList') ? 'ap-template-editor__toolbar-btn--active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          disabled={disabled} 
          title="Bullet list"
        >
          •
        </button>
        <button 
          className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('orderedList') ? 'ap-template-editor__toolbar-btn--active' : ''}`}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
          disabled={disabled} 
          title="Numbered list"
        >
          1.
        </button>
      </div>

      <div className="ap-template-editor__toolbar-separator" />

      {/* Media */}
      <div className="ap-template-editor__toolbar-group">
        <button 
          className="ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon" 
          onClick={() => setDialogType('image')} 
          disabled={disabled} 
          title="Insert image"
        >
          🖼️
        </button>
        <button 
          className="ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon" 
          onClick={insertHorizontalRule} 
          disabled={disabled} 
          title="Insert horizontal rule"
        >
          ─
        </button>
      </div>

      {/* Spacer to push view toggle to the right */}
      <div className="ap-template-editor__toolbar-spacer" />

      {/* View toggle */}
      {showMarkdownToggle && (
        <button
          className={`ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--toggle ${view === 'markdown' ? 'ap-template-editor__toolbar-btn--active' : ''}`}
          onClick={onToggleView}
          title="Toggle markdown view (Ctrl+M)"
        >
          <span className="ap-toolbar-icon">&lt;/&gt;</span>
          <span className="ap-toolbar-label">{view === 'rich' ? 'Markdown' : 'Rich'}</span>
        </button>
      )}

      {/* Insert dialog */}
      {activeConfig && ReactDOM.createPortal(
        <InsertDialog
          title={activeConfig.title}
          fields={activeConfig.fields}
          onInsert={handleInsert}
          onClose={() => setDialogType(null)}
        />,
        document.body
      )}
    </div>
  );
};
