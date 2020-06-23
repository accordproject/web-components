/* React */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import { ClauseContext } from '../Clause';
import { ClauseConditional, ClauseConditionalTooltip } from '../styles';

import * as conditionalIcon from '../../icons/conditional';

/**
 * Component to render an addition symbol for an empty conditional
 * This will have an key property of the Slate node
 * @param {*} props
 */
const ConditionalBoolean = (props) => {
  const [hoveringConditional, setHoveringConditional] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setTooltipHeight(ref.current ? ref.current.offsetHeight : 0);
  }, []);

  const conditionalIconProps = {
    'aria-label': conditionalIcon.type,
    viewBox: '0 0 18 18',
    className: 'conditionalIcon',
    onMouseEnter: () => setHoveringConditional(true),
    onMouseLeave: () => setHoveringConditional(false),
    onClick: props.toggleConditional
  };

  const conditionalTooltip = {
    ref,
    currentHover: hoveringConditional,
    className: 'variableTooltip',
    style: { marginTop: `-${tooltipHeight + 10}px` },
    caretTop: tooltipHeight - 2,
    caretLeft: 2,
  };

  return (
    <ClauseContext.Consumer>
      { hoveringClause => (<>
        <ClauseConditionalTooltip
          contentEditable={false}
          {...conditionalTooltip}
        >
          Show text: "{props.whenTrue}"
        </ClauseConditionalTooltip>
        <ClauseConditional
          contentEditable={false}
          currentHover={hoveringClause}
          {...conditionalIconProps}
        >
          {conditionalIcon.icon(hoveringConditional)}
        </ClauseConditional>
      </>) }
    </ClauseContext.Consumer>
  );
};

ConditionalBoolean.propTypes = {
  whenTrue: PropTypes.string,
  toggleConditional: PropTypes.func,
};

export default ConditionalBoolean;
