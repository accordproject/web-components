import React from 'react';
import { MOD } from '../../utilities/tooltipHelpers';
import { BUTTON_COLORS } from '../../utilities/constants';

const icon = () => (
<path className="st0" fill={BUTTON_COLORS.SYMBOL_INACTIVE} d="M14.8,6.5H6.7C6.4,6.5,6.2,6.2,6.2,6V1.9c0-0.3-0.3-0.5-0.5-0.5H4.8c-0.3,0-0.5,0.3-0.5,0.5v5.9
	c0,0.3,0.3,0.5,0.5,0.5h11.9c0.3,0,0.5-0.3,0.5-0.5V1.9c0-0.3-0.3-0.5-0.5-0.5h-0.9c-0.3,0-0.5,0.3-0.5,0.5V6
	C15.3,6.2,15.2,6.5,14.8,6.5 M6.7,12.9h8.2c0.3,0,0.5,0.3,0.5,0.5v4.1c0,0.3,0.3,0.5,0.5,0.5h0.9c0.3,0,0.5-0.3,0.5-0.5v-5.9
	c0-0.3-0.3-0.5-0.5-0.5H4.8c-0.3,0-0.5,0.3-0.5,0.5v5.9c0,0.3,0.3,0.5,0.5,0.5h0.8c0.3,0,0.5-0.3,0.5-0.5v-4.1
	C6.2,13.1,6.4,12.9,6.7,12.9 M0.6,7.4v4.5c0,0.4,0.5,0.7,0.8,0.3L3.7,10c0.2-0.2,0.2-0.5,0-0.7L1.5,7C1.1,6.7,0.6,7,0.6,7.4"/>
);

const tbreak = {
  type: 'horizontal_rule',
  label: `Page Break (${MOD()}+Enter)`,
  height: '25px',
  width: '25px',
  padding: '4px',
  viewBox: '0 0 19 19',
  icon,
};

export default tbreak;
