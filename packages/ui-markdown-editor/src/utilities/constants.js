const MISC_CONSTANTS = {
  DROPDOWN_COLOR: '#122330',
  DROPDOWN_WEIGHT: 'bold',
  DROPDOWN_NORMAL: 'Normal',
};

export const BUTTON_COLORS = {
  BACKGROUND_INACTIVE: '#FFFFFF',
  BACKGROUND_ACTIVE: '#F0F0F0',
  SYMBOL_INACTIVE: '#949CA2',
  SYMBOL_ACTIVE: '#414F58',
  TOOLTIP_BACKGROUND: '#FFFFFF',
  TOOLTIP: '#000000',
};

export const BUTTON_ACTIVE = {
  background: BUTTON_COLORS.BACKGROUND_ACTIVE,
  symbol: BUTTON_COLORS.SYMBOL_ACTIVE
};

export const BLOCK_STYLE = {
  paragraph: MISC_CONSTANTS.DROPDOWN_NORMAL,
  heading_one: 'Heading 1',
  heading_two: 'Heading 2',
  heading_three: 'Heading 3',
  heading_four: 'Heading 4',
  heading_five: 'Heading 5',
  heading_six: 'Heading 6',
  block_quote: MISC_CONSTANTS.DROPDOWN_NORMAL,
  list_item: MISC_CONSTANTS.DROPDOWN_NORMAL,
  link: MISC_CONSTANTS.DROPDOWN_NORMAL,
};

export const DROPDOWN_STYLE = {
  color: BUTTON_COLORS.SYMBOL_ACTIVE,
  alignSelf: 'center',
  width: '100px',
};

export const CODEBLOCK_STYLING = {
	padding: '1rem',
  maxWidth: '100%',
  borderRadius: '6px',
	backgroundColor: '#F7F7F7',
	fontFamily: 'monospace'
};

export const PARAGRAPH_STYLING = {
	lineHeight: '1.4rem',
}

export const H1_STYLING = {
  fontSize: '25px',
  lineHeight: '23px',
  margin: '2rem 0rem 1rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
  textAlign: 'center',
};

export const H2_STYLING = {
  fontSize: '25px',
  lineHeight: '23px',
  margin: '1.8rem 0rem 0.9rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const H3_STYLING = {
  fontSize: '20px',
  lineHeight: '20px',
  margin: '1.6rem 0rem 0.8rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const H4_STYLING = {
  fontSize: '18px',
  lineHeight: '18px',
  margin: '1.4rem 0rem 0.7rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const H5_STYLING = {
  fontSize: '16px',
  lineHeight: '16px',
  margin: '1.2rem 0rem 0.6rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const H6_STYLING = {
  fontSize: '14px',
  lineHeight: '14px',
  color: '#949CA2',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
  margin: '1.2rem 0rem 0.5rem 0rem',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
};

export const TOOLBAR_DROPDOWN_STYLE_H1 = {
  ...H1_STYLING,
  margin: 0
};

export const TOOLBAR_DROPDOWN_STYLE_H2 = {
  ...H2_STYLING,
  margin: 0
};

export const TOOLBAR_DROPDOWN_STYLE_H3 = {
  ...H3_STYLING,
  margin: 0
};

export const TOOLBAR_DROPDOWN_STYLE_H4 = {
  ...H4_STYLING,
  margin: 0
};

export const TOOLBAR_DROPDOWN_STYLE_H5 = {
  ...H5_STYLING,
  margin: 0
};

export const TOOLBAR_DROPDOWN_STYLE_H6 = {
  ...H6_STYLING,
  margin: 0
};

export const POPUP_STYLE = {
  borderRadius: '5px',
  backgroundColor: BUTTON_COLORS.TOOLTIP_BACKGROUND,
  color: BUTTON_COLORS.TOOLTIP,
};
