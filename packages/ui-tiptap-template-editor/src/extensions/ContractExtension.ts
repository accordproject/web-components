import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateContractNodeView } from '../nodeViews/TemplateContractNodeView';

/**
 * ContractDefinition block extension for TemplateMark.
 * Represents a contract document wrapper.
 * $class: org.accordproject.templatemark@0.5.0.ContractDefinition
 */
export const ContractExtension = Node.create({
  name: 'contract',
  group: 'block',
  content: 'block+',
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="contract"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'contract' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateContractNodeView);
  },
});
