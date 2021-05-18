import React from 'react';
import { MOD } from '../../utilities/tooltipHelpers';

/**
 * Renders the icon for Italic in svg format.
 * 
 * @param {string} fillColor Color to fill the svg
 * @returns {HTMLOrSVGElement} SVG for the Italic icon
 */
const icon = fillColor => (
  <g
    stroke="none"
    strokeWidth="1"
    fill="none"
    fillRule="evenodd"
    fontFamily="IBMPlexSans-BoldItalic, IBM Plex Sans"
    fontSize="18"
    fontStyle="italic"
    fontWeight="bold"
  >
    <g transform="translate(-477.000000, -48.000000)" fill={fillColor}>
      <text>
        <tspan x="478" y="61">
          I
        </tspan>
      </text>
    </g>
  </g>
);

const italic = {
    type: 'italic',
    label: `Italic (${MOD()}+I)`,
    height: '25px',
    width: '25px',
    padding: '5px 7px',
    viewBox: '0 0 10 13',
    icon,
  };
  
  export default italic;