/* React */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import { ClauseContext } from '../Clause';
import { ClauseOptional, ClauseOptionalTooltip } from '../styles';

import * as optionalIcon from '../../icons/conditional';

/**
 * Component to render an addition symbol for an empty optional
 * This will have an key property of the Slate node
 * @param {*} props
 */
const OptionalBoolean = (props) => {
  const [hoveringOptional, setHoveringOptional] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setTooltipHeight(ref.current ? ref.current.offsetHeight : 0);
  }, []);

  const optionalIconProps = {
    'aria-label': optionalIcon.type,
    viewBox: '0 0 18 18',
    className: 'optionalIcon',
    onMouseEnter: () => setHoveringOptional(true),
    onMouseLeave: () => setHoveringOptional(false),
    onClick: props.toggleOptional
  };

  const optionalTooltip = {
    ref,
    currentHover: hoveringOptional,
    className: 'optionalTooltip',
    style: { marginTop: `-${tooltipHeight + 10}px` },
    caretTop: tooltipHeight - 2,
    caretLeft: 2,
  };

  return (
    <ClauseContext.Consumer>
      { hoveringClause => (<>
        <ClauseOptionalTooltip
          contentEditable={false}
          {...optionalTooltip}
        >
          Show text: "{props.whenSome}"
        </ClauseOptionalTooltip>
        <ClauseOptional
          contentEditable={false}
          currentHover={hoveringClause}
          {...optionalIconProps}
        >
          {optionalIcon.icon(hoveringOptional)}
        </ClauseOptional>
      </>) }
    </ClauseContext.Consumer>
  );
};

OptionalBoolean.propTypes = {
  whenSome: PropTypes.string,
  toggleOptional: PropTypes.func,
};

export default OptionalBoolean;
