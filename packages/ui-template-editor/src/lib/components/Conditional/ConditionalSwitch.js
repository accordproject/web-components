/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Actions */
import { childReducer } from '../actions';

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
  const trueHasLength = childReducer(props.whenTrue).length;
  const falseHasLength = childReducer(props.whenFalse).length;
  const tooltipText = props.isTrue ? childReducer(props.whenFalse) : childReducer(props.whenTrue);
  const tooltipInstructions = (text) => {
    if (trueHasLength && falseHasLength) return `Change to: "${text}"`;
    if (props.isContentShowing) return 'Hide text';
    return `Change to: "${text}"`;
  };

  return (
    <>
      <ClauseConditionalTooltip
        contentEditable={false}
        {...conditionalTooltip}
      >
        {tooltipInstructions(tooltipText)}
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
