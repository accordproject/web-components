/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Styling */
import { ClauseOptionalTooltip } from '../styles';

/**
 * Component to render a tooltip
 * Displays what the optional text will be changed to
 * @param {*} props
 */
const OptionalSwitch = (props) => {
  const optionalTooltip = {
    className: 'optionalTooltip',
    currentHover: props.currentHover,
    caretTop: 21,
    caretLeft: 2,
    tooltipHeight: 1.85,
  };
  const tooltipText = props.hasSome ? props.hasNone : props.hasSome;
  const tooltipInstructions = props.isContentShowing
    ? 'Hide text'
    : `Change to: "${tooltipText}"`;

  return (
    <>
      <ClauseOptionalTooltip
        contentEditable={false}
        {...optionalTooltip}
      >
        {tooltipInstructions}
      </ClauseOptionalTooltip>
    </>
  );
};

OptionalSwitch.propTypes = {
  currentHover: PropTypes.bool,
  isContentShowing: PropTypes.bool,
  whenTrue: PropTypes.string,
  hasNone: PropTypes.string,
  hasSome: PropTypes.bool,
};

export default OptionalSwitch;
