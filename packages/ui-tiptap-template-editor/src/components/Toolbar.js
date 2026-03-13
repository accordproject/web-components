import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { InsertDialog } from './dialogs/Modal';
import { PRIMITIVE_TYPES, ACCORD_PROJECT_TYPES, getFullTypeName } from '../constants/types';
import '../styles/toolbar.css';
const DropdownMenu = ({ label, icon, items, onSelect, disabled }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open)
            document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);
    return (_jsxs("div", { className: "ap-toolbar-dropdown", ref: ref, children: [_jsxs("button", { className: `ap-template-editor__toolbar-btn ap-toolbar-dropdown__trigger ${open ? 'ap-toolbar-dropdown__trigger--open' : ''}`, onClick: () => setOpen(!open), disabled: disabled, title: label, "aria-haspopup": "true", "aria-expanded": open, children: [icon, " ", label, " ", _jsx("span", { className: "ap-toolbar-dropdown__caret", children: "\u25BE" })] }), open && (_jsx("div", { className: "ap-toolbar-dropdown__menu", role: "menu", children: items.map((item) => (_jsxs("button", { className: "ap-toolbar-dropdown__item", onClick: () => { onSelect(item.id); setOpen(false); }, title: item.title, role: "menuitem", children: [_jsx("span", { className: "ap-toolbar-dropdown__item-icon", children: item.icon }), item.label] }, item.id))) }))] }));
};
// ── Dialog field configs ───────────────────────────────────────────────────────
const ALL_TYPE_OPTIONS = [...PRIMITIVE_TYPES, ...Object.keys(ACCORD_PROJECT_TYPES)];
const NAME_FIELD = (placeholder) => ({
    name: 'name',
    label: 'Variable Name',
    type: 'text',
    required: true,
    placeholder,
});
const DIALOG_CONFIGS = {
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
export const Toolbar = ({ editor, view, onToggleView, showMarkdownToggle = true }) => {
    const [dialogType, setDialogType] = useState(null);
    const handleInsert = useCallback((values) => {
        if (!editor || !dialogType)
            return;
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
                if (enumValues.length === 0)
                    return;
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
        if (!editor)
            return;
        editor.chain().focus().setHorizontalRule().run();
    }, [editor]);
    const disabled = !editor || view === 'markdown';
    const activeConfig = dialogType ? DIALOG_CONFIGS[dialogType] : null;
    // Dropdown menu items
    const logicItems = [
        { id: 'conditional', label: 'If (inline)', icon: '?', title: 'Insert inline conditional' },
        { id: 'optional', label: 'Optional (inline)', icon: '◯', title: 'Insert inline optional' },
        { id: 'conditionalBlock', label: 'If Block', icon: '❓', title: 'Insert conditional block with true/false branches' },
        { id: 'optionalBlock', label: 'Optional Block', icon: '◻', title: 'Insert optional block with some/none branches' },
        { id: 'withBlock', label: 'With Block', icon: '🔗', title: 'Insert scoped with block' },
    ];
    const listItems = [
        { id: 'listBullet', label: 'Template Bullet List', icon: '•', title: 'Insert bullet list loop (ulist)' },
        { id: 'listOrdered', label: 'Template Ordered List', icon: '1.', title: 'Insert ordered list loop (olist)' },
    ];
    const structureItems = [
        { id: 'clause', label: 'Clause', icon: '📋', title: 'Insert a clause block' },
        { id: 'contract', label: 'Contract', icon: '📄', title: 'Insert a contract wrapper' },
    ];
    return (_jsxs("div", { className: "ap-template-editor__toolbar", role: "toolbar", "aria-label": "Template editor toolbar", children: [_jsxs("div", { className: "ap-template-editor__toolbar-group ap-template-editor__toolbar-group--primary", children: [_jsxs("button", { className: "ap-template-editor__toolbar-btn", onClick: () => setDialogType('variable'), disabled: disabled, title: "Insert variable", children: [_jsx("span", { className: "ap-toolbar-icon", children: "\u00B6" }), _jsx("span", { className: "ap-toolbar-label", children: "Variable" })] }), _jsxs("button", { className: "ap-template-editor__toolbar-btn", onClick: () => setDialogType('formula'), disabled: disabled, title: "Insert formula", children: [_jsx("span", { className: "ap-toolbar-icon", children: "\u0192" }), _jsx("span", { className: "ap-toolbar-label", children: "Formula" })] })] }), _jsx("div", { className: "ap-template-editor__toolbar-separator" }), _jsxs("div", { className: "ap-template-editor__toolbar-group", children: [_jsx(DropdownMenu, { label: "Data", icon: "\u2699", items: [
                            { id: 'enum', label: 'Enum Variable', icon: '≡', title: 'Insert enum with options' },
                        ], onSelect: setDialogType, disabled: disabled }), _jsx(DropdownMenu, { label: "Logic", icon: "\u26A1", items: logicItems, onSelect: setDialogType, disabled: disabled }), _jsx(DropdownMenu, { label: "Structure", icon: "\uD83D\uDCE6", items: [...structureItems, ...listItems], onSelect: setDialogType, disabled: disabled })] }), _jsx("div", { className: "ap-template-editor__toolbar-separator" }), _jsxs("div", { className: "ap-template-editor__toolbar-group", children: [_jsx("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('bold') ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: () => editor?.chain().focus().toggleBold().run(), disabled: disabled, title: "Bold (Ctrl+B)", children: _jsx("strong", { children: "B" }) }), _jsx("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('italic') ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: () => editor?.chain().focus().toggleItalic().run(), disabled: disabled, title: "Italic (Ctrl+I)", children: _jsx("em", { children: "I" }) }), _jsx("div", { className: "ap-toolbar-btn-group", children: [1, 2, 3].map((level) => (_jsxs("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('heading', { level }) ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: () => editor?.chain().focus().toggleHeading({ level: level }).run(), disabled: disabled, title: `Heading ${level}`, children: ["H", level] }, level))) })] }), _jsx("div", { className: "ap-template-editor__toolbar-separator" }), _jsxs("div", { className: "ap-template-editor__toolbar-group", children: [_jsx("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('bulletList') ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: () => editor?.chain().focus().toggleBulletList().run(), disabled: disabled, title: "Bullet list", children: "\u2022" }), _jsx("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon ${editor?.isActive('orderedList') ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: () => editor?.chain().focus().toggleOrderedList().run(), disabled: disabled, title: "Numbered list", children: "1." })] }), _jsx("div", { className: "ap-template-editor__toolbar-separator" }), _jsxs("div", { className: "ap-template-editor__toolbar-group", children: [_jsx("button", { className: "ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon", onClick: () => setDialogType('image'), disabled: disabled, title: "Insert image", children: "\uD83D\uDDBC\uFE0F" }), _jsx("button", { className: "ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--icon", onClick: insertHorizontalRule, disabled: disabled, title: "Insert horizontal rule", children: "\u2500" })] }), _jsx("div", { className: "ap-template-editor__toolbar-spacer" }), showMarkdownToggle && (_jsxs("button", { className: `ap-template-editor__toolbar-btn ap-template-editor__toolbar-btn--toggle ${view === 'markdown' ? 'ap-template-editor__toolbar-btn--active' : ''}`, onClick: onToggleView, title: "Toggle markdown view (Ctrl+M)", children: [_jsx("span", { className: "ap-toolbar-icon", children: "</>" }), _jsx("span", { className: "ap-toolbar-label", children: view === 'rich' ? 'Markdown' : 'Rich' })] })), activeConfig && ReactDOM.createPortal(_jsx(InsertDialog, { title: activeConfig.title, fields: activeConfig.fields, onInsert: handleInsert, onClose: () => setDialogType(null) }), document.body)] }));
};
