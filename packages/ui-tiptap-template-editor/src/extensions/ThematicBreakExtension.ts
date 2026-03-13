import HorizontalRule from '@tiptap/extension-horizontal-rule';

/**
 * ThematicBreak extension configured for TemplateMark.
 * Maps to org.accordproject.commonmark@0.5.0.ThematicBreak
 *
 * Uses TipTap's built-in horizontal rule with default rendering.
 */
export const ThematicBreakExtension = HorizontalRule.extend({
  name: 'thematicBreak',
});
