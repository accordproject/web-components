const MISC_CONSTANTS = {
  DROPDOWN_COLOR: '#122330',
  DROPDOWN_WEIGHT: 'bold',
  DROPDOWN_NORMAL: 'Normal'
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
  block_quote: MISC_CONSTANTS.DROPDOWN_NORMAL,
  list_item: MISC_CONSTANTS.DROPDOWN_NORMAL,
  link: MISC_CONSTANTS.DROPDOWN_NORMAL,
};

export const DROPDOWN_STYLE = {
  color: BUTTON_COLORS.SYMBOL_ACTIVE,
  alignSelf: 'center',
  width: '100px',
};

export const DROPDOWN_STYLE_H1 = {
  fontSize: '25px',
  lineHeight: '23px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
  textAlign: 'center',
};

export const DROPDOWN_STYLE_H2 = {
  fontSize: '20px',
  lineHeight: '20px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const DROPDOWN_STYLE_H3 = {
  fontSize: '16px',
  lineHeight: '16px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const DROPDOWN_STYLE_H4 = {
  fontSize: '15px',
  lineHeight: '15px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const DROPDOWN_STYLE_H5 = {
  fontSize: '14x',
  lineHeight: '14px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const DROPDOWN_STYLE_H6 = {
  fontSize: '13px',
  lineHeight: '13px',
  fontWeight: MISC_CONSTANTS.DROPDOWN_WEIGHT,
  color: MISC_CONSTANTS.DROPDOWN_COLOR,
};

export const POPUP_STYLE = {
  borderRadius: '5px',
  backgroundColor: BUTTON_COLORS.TOOLTIP_BACKGROUND,
  color: BUTTON_COLORS.TOOLTIP,
};
