import React from 'react';
import { MOD } from '../../utilities/tooltipHelpers';
import { BUTTON_COLORS } from '../../utilities/constants';

const icon = () => (
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      fontFamily="IBMPlexSans-Bold, IBM Plex Sans"
      fontSize="18"
      fontWeight="bold"
    >
      <g transform="translate(-440.000000, -48.000000)" fill={BUTTON_COLORS.SYMBOL_INACTIVE}>
        <text>
          <tspan x="439" y="61">
            -
          </tspan>
        </text>
      </g>
    </g>
);

const tbreak = {
  type: 'horizontal_rule',
  label: 'Thematic Break',
  height: '25px',
  width: '25px',
  padding: '5px 7px',
  viewBox: '0 0 11 13',
  icon,
};

export default tbreak;
