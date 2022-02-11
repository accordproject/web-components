import {
  LINK, IMAGE, BLOCK_QUOTE, UL_LIST, OL_LIST,
  MARK_BOLD, MARK_ITALIC, MARK_CODE, HR, LINEBREAK,
  PARAGRAPH_BREAK
} from './schema';

const HOTKEYS = {
  'mod+b': {
    type: 'mark',
    code: MARK_BOLD,
  },
  'mod+i': {
    type: 'mark',
    code: MARK_ITALIC,
  },
  'mod+shift+9': {
    type: 'mark',
    code: MARK_CODE,
  },
  'mod+shift+7': {
    type: 'block',
    code: OL_LIST,
  },
  'mod+shift+8': {
    type: 'block',
    code: UL_LIST,
  },
  'mod+shift+.': {
    type: 'block',
    code: BLOCK_QUOTE,
  },
  'mod+shift+g': {
    type: 'image',
    code: IMAGE,
  },
  'mod+z': {
    type: 'special',
    code: 'undo',
  },
  'mod+shift+z': {
    type: 'special',
    code: 'redo',
  },
  'mod+k': {
    type: 'link',
    code: LINK,
  },
  'mod+enter': {
    type: 'horizontal_rule',
    code: HR,
  },
  'shift+enter': {
    type: 'linebreak',
    code: LINEBREAK,
  },
  'enter': {
    type: 'paragraph_break',
    code: PARAGRAPH_BREAK,
  }
};

export const ENTER_LIST = {
  [OL_LIST]: true,
  [UL_LIST]: true,
};

export const ENTER_BLOCK = {
  [BLOCK_QUOTE]: true,
  ...ENTER_LIST
};

export const formattingHotKeys = ['mod+b', 'mod+i', 'mod+shift+7', 'mod+shift+8', 'mod+shift+9', 'mod+shift+.', 'mod+shift+g', 'mod+k', 'mod+enter', 'shift+enter', 'enter'];

export const ENTER = 'enter';
export const ENTER_SHIFT = 'shift+enter';

export default HOTKEYS;
