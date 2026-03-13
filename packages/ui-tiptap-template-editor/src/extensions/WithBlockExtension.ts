import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateWithBlockNodeView } from '../nodeViews/TemplateWithBlockNodeView';

/**
 * WithBlockDefinition block extension for TemplateMark.
 * Block-level scoping context (distinct from inline WithDefinition).
 * $class: org.accordproject.templatemark@0.5.0.WithBlockDefinition
 */
export const WithBlockExtension = Node.create({
  name: 'withBlockDef',
  group: 'block',
  content: 'block+',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      name: { default: '' },
      elementType: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="withBlockDef"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'withBlockDef' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateWithBlockNodeView);
  },
});
