import React from 'react';
import { MOD } from '../../utilities/tooltipHelpers';

const icon = fillColor => (
  <g
    transform="translate(0, 1.000000)"
    fill={fillColor}
    fillRule="nonzero"
  >
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" strokeWidth="2"/>
    <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z" strokeWidth="2"/>
  </g>

);

const codeblock = {
    type: 'code_block',
    label: `Code Block (${MOD()}+Shift+0)`,
    height: '25px',
    width: '25px',
    padding: '6px 2px 4px',
    viewBox: '0 0 20 18',
    icon,
};
  
  export default codeblock;