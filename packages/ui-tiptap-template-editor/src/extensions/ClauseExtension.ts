import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateClauseNodeView } from '../nodeViews/TemplateClauseNodeView';

export interface ClauseExtensionOptions {
  onClauseEdit?: (src: string) => void;
  onClauseTest?: (clauseJson: unknown) => void;
}

/**
 * ClauseDefinition block extension for TemplateMark.
 * Represents a clause within a contract template.
 * $class: org.accordproject.templatemark@0.5.0.ClauseDefinition
 */
export const ClauseExtension = Node.create<ClauseExtensionOptions>({
  name: 'clause',
  group: 'block',
  content: 'block+',
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      onClauseEdit: undefined,
      onClauseTest: undefined,
    };
  },

  addAttributes() {
    return {
      name: { default: '' },
      src: { default: null },
      elementType: { default: null },
      // Condition is a Code object per spec: { type: 'TYPESCRIPT' | 'ES_2020', contents: string }
      condition: { default: null },
      // Additional attributes for error handling
      error: { default: null },
      parseable: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="clause"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'clause' }), 0];
  },

  addNodeView() {
    const options = this.options;
    return ReactNodeViewRenderer((props) => TemplateClauseNodeView({ ...props, clauseOptions: options }));
  },
});
