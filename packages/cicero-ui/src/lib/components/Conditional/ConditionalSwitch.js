/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Styling */
import { ClauseConditionalTooltip } from '../styles';

/**
 * Component to render a tooltip
 * Displays what the conditional text will be changed to
 * @param {*} props
 */
const ConditionalSwitch = (props) => {
  const conditionalTooltip = {
    className: 'conditionalTooltip',
    currentHover: props.currentHover,
    caretTop: 1.45,
    caretLeft: 2,
    tooltipHeight: 1.85,
  };
  const tooltipText = props.isFalse
    ? props.whenTrue
    : props.whenFalse;
  const tooltipInstructions = props.whenFalse === ''
    ? 'Hide text'
    : `Change to: "${tooltipText}"`;

  return (
    <>
      <ClauseConditionalTooltip {...conditionalTooltip}>
        {tooltipInstructions}
      </ClauseConditionalTooltip>
    </>
  );
};

ConditionalSwitch.propTypes = {
  currentHover: PropTypes.bool,
  whenTrue: PropTypes.string,
  whenFalse: PropTypes.string,
  isFalse: PropTypes.bool,
};

export default ConditionalSwitch;
