import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateOptionalBlockNodeView } from '../nodeViews/TemplateOptionalBlockNodeView';

/**
 * OptionalBlockDefinition block extension for TemplateMark.
 * Block-level optional with whenSome/whenNone branches as nested content.
 * $class: org.accordproject.templatemark@0.5.0.OptionalBlockDefinition
 *
 * Distinct from inline OptionalDefinition which stores branches as JSON strings.
 */
export const OptionalBlockExtension = Node.create({
  name: 'optionalBlock',
  group: 'block',
  content: 'optionalBranchSome optionalBranchNone',
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      name: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="optionalBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'optionalBlock' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateOptionalBlockNodeView);
  },
});

/**
 * Helper node for the "some" branch content (when value is present).
 */
export const OptionalBranchSomeExtension = Node.create({
  name: 'optionalBranchSome',
  group: 'optionalBranch',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-branch="some"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-branch': 'some', class: 'ap-optional-branch ap-optional-branch--some' }), 0];
  },
});

/**
 * Helper node for the "none" branch content (when value is absent).
 */
export const OptionalBranchNoneExtension = Node.create({
  name: 'optionalBranchNone',
  group: 'optionalBranch',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-branch="none"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-branch': 'none', class: 'ap-optional-branch ap-optional-branch--none' }), 0];
  },
});
