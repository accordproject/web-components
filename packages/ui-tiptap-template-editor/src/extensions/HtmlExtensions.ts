import { Node, mergeAttributes } from '@tiptap/core';

/**
 * HtmlInline extension for TemplateMark.
 * Maps to org.accordproject.commonmark@0.5.0.HtmlInline
 *
 * Renders raw HTML inline content (escaped in editing view for safety).
 */
export const HtmlInlineExtension = Node.create({
  name: 'htmlInline',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="htmlInline"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    // In editing mode, show escaped HTML content
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'htmlInline',
        class: 'ap-html-inline',
        title: 'Raw HTML (inline)',
      }),
      `‹${node.attrs.text}›`,
    ];
  },
});

/**
 * HtmlBlock extension for TemplateMark.
 * Maps to org.accordproject.commonmark@0.5.0.HtmlBlock
 *
 * Renders raw HTML block content (escaped in editing view for safety).
 */
export const HtmlBlockExtension = Node.create({
  name: 'htmlBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      text: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="htmlBlock"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    // In editing mode, show escaped HTML in a code-like block
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'htmlBlock',
        class: 'ap-html-block',
        style: 'background: #f7fafc; border: 1px dashed #cbd5e0; padding: 8px; margin: 8px 0; font-family: monospace; font-size: 12px; white-space: pre-wrap; color: #718096;',
      }),
      `<!-- HTML Block -->\n${node.attrs.text}`,
    ];
  },
});
