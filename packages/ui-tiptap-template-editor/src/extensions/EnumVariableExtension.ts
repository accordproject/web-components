import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateEnumVariableNodeView } from '../nodeViews/TemplateEnumVariableNodeView';

export const EnumVariableExtension = Node.create({
  name: 'enumVariable',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
      enumValues: { default: [] },
      value: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="enumVariable"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'enumVariable' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateEnumVariableNodeView);
  },
});
