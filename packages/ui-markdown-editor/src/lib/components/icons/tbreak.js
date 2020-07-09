import React from 'react';
import { MOD } from '../../utilities/tooltipHelpers';
import { BUTTON_COLORS } from '../../utilities/constants';

const icon = () => (
<path className="st0" fill={BUTTON_COLORS.SYMBOL_INACTIVE} d="M17,6.1H7.2c-0.3,0-0.6-0.3-0.6-0.6V0.6C6.6,0.3,6.3,0,6,0H5C4.7,0,4.4,0.3,4.4,0.6v7.1C4.4,8,4.7,8.3,5,8.3
	h14.3c0.3,0,0.6-0.3,0.6-0.6V0.6c0-0.3-0.3-0.6-0.6-0.6h-1.1c-0.3,0-0.6,0.3-0.6,0.6v4.9C17.6,5.8,17.4,6.1,17,6.1 M7.2,13.8H17
	c0.3,0,0.6,0.3,0.6,0.6v4.9c0,0.3,0.3,0.6,0.6,0.6h1.1c0.3,0,0.6-0.3,0.6-0.6v-7.1c0-0.3-0.3-0.6-0.6-0.6H5c-0.3,0-0.6,0.3-0.6,0.6
	v7.1c0,0.3,0.3,0.6,0.6,0.6H6c0.3,0,0.6-0.3,0.6-0.6v-4.9C6.6,14,6.9,13.8,7.2,13.8 M0,7.2v5.4c0,0.5,0.6,0.8,1,0.4l2.7-2.7
	c0.2-0.2,0.2-0.6,0-0.8L1,6.8C0.6,6.4,0,6.7,0,7.2"/>
);

const tbreak = {
  type: 'horizontal_rule',
  label: `Page Break (${MOD()}+Ctrl+Enter)`,
  height: '17px',
  width: '17px',
  viewBox: '0 0 19 19',
  icon,
};

export default tbreak;
