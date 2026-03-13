import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateConditionalBlockNodeView } from '../nodeViews/TemplateConditionalBlockNodeView';

/**
 * ConditionalBlockDefinition block extension for TemplateMark.
 * Block-level conditional with whenTrue/whenFalse branches as nested content.
 * $class: org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition
 *
 * Distinct from inline ConditionalDefinition which stores branches as JSON strings.
 */
export const ConditionalBlockExtension = Node.create({
  name: 'conditionalBlock',
  group: 'block',
  content: 'conditionalBranchTrue conditionalBranchFalse',
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      name: { default: '' },
      // Condition is a Code object per spec: { type: 'TYPESCRIPT' | 'ES_2020', contents: string }
      condition: { default: null },
      dependencies: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="conditionalBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'conditionalBlock' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateConditionalBlockNodeView);
  },
});

/**
 * Helper node for the "true" branch content.
 */
export const ConditionalBranchTrueExtension = Node.create({
  name: 'conditionalBranchTrue',
  group: 'conditionalBranch',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-branch="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-branch': 'true', class: 'ap-conditional-branch ap-conditional-branch--true' }), 0];
  },
});

/**
 * Helper node for the "false" branch content.
 */
export const ConditionalBranchFalseExtension = Node.create({
  name: 'conditionalBranchFalse',
  group: 'conditionalBranch',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-branch="false"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-branch': 'false', class: 'ap-conditional-branch ap-conditional-branch--false' }), 0];
  },
});
