import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateFormulaNodeView } from '../nodeViews/TemplateFormulaNodeView';

export const FormulaExtension = Node.create({
  name: 'formula',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
      dependencies: { default: [] },
      codeContents: { default: '' },
      value: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="formula"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'formula' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateFormulaNodeView);
  },
});
