export const OL_LIST = 'ol_list';
export const UL_LIST = 'ul_list';
export const LIST_ITEM = 'list_item';
export const LIST_TYPES = [OL_LIST, UL_LIST];

export const BLOCK_QUOTE = 'block_quote';
export const PARAGRAPH = 'paragraph';
export const HTML_BLOCK = 'html_block';
export const CODE_BLOCK = 'code_block';

export const H1 = 'heading_one';
export const H2 = 'heading_two';
export const H3 = 'heading_three';
export const H4 = 'heading_four';
export const H5 = 'heading_five';
export const H6 = 'heading_six';
export const HEADINGS = [H1, H2, H3, H4, H5, H6];

export const MARK_BOLD = 'bold';
export const MARK_ITALIC = 'italic';
export const MARK_CODE = 'code';
export const MARK_HTML = 'html';
export const MARKS = [MARK_BOLD, MARK_ITALIC, MARK_CODE, MARK_HTML];

export const HR = 'horizontal_rule';
export const SOFTBREAK = 'softbreak';
export const PARAGRAPH_BREAK = 'paragraph_break';
export const LINEBREAK = 'linebreak';
export const LINK = 'link';
export const IMAGE = 'image';
export const HTML_INLINE = 'html_inline';
export const HEADINGBREAK = 'headingbreak';

const INLINES = {
  [LINEBREAK]: true,
  [SOFTBREAK]: true,
  [PARAGRAPH_BREAK]: true,
  [HTML_INLINE]: true,
  [LINK]: true,
  [IMAGE]: true,
};
const VOIDS = {
  [LINEBREAK]: true,
  [PARAGRAPH_BREAK]: true,
  [SOFTBREAK]: true,
  [IMAGE]: true,
  [HR]: true,
};

/* eslint no-param-reassign: 0 */
const withSchema = (editor) => {
  const { isVoid, isInline } = editor;
  editor.isInline = element => (INLINES[element.type] || isInline(editor));
  editor.isVoid = element => (VOIDS[element.type] || isVoid(editor));

  return editor;
};

export default withSchema;
