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
    className: 'variableTooltip',
    currentHover: props.currentHover,
    caretTop: 21,
    caretLeft: 2,
    tooltipHeight: 1.85,
  };
  const tooltipText = props.isTrue ? props.whenFalse : props.whenTrue;
  const tooltipInstructions = props.isContentShowing
    ? 'Hide text'
    : `Change to: "${tooltipText}"`;

  return (
    <>
      <ClauseConditionalTooltip
        contentEditable={false}
        {...conditionalTooltip}
      >
        {tooltipInstructions}
      </ClauseConditionalTooltip>
    </>
  );
};

ConditionalSwitch.propTypes = {
  currentHover: PropTypes.bool,
  isContentShowing: PropTypes.bool,
  whenTrue: PropTypes.string,
  whenFalse: PropTypes.string,
  isTrue: PropTypes.bool,
};

export default ConditionalSwitch;
