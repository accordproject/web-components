import { Node, mergeAttributes } from '@tiptap/core';
/**
 * ListItem extension for TemplateMark list blocks.
 * Maps to org.accordproject.commonmark@0.5.0.Item
 *
 * group: 'block' is required so this node is valid inside
 * ListBlockExtension which uses content: 'block+'.
 */
export const ListItemExtension = Node.create({
    name: 'listItem',
    group: 'block',
    content: 'paragraph block*',
    defining: true,
    parseHTML() {
        return [{ tag: 'li' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['li', mergeAttributes(HTMLAttributes), 0];
    },
    addKeyboardShortcuts() {
        return {
            // Enter: split list item (create new item)
            Enter: () => this.editor.commands.splitListItem(this.name),
            // Shift+Enter: insert hard break (new line within item)
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
            // Tab: sink (indent) list item
            Tab: () => this.editor.commands.sinkListItem(this.name),
            // Shift+Tab: lift (outdent) list item
            'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
        };
    },
});
