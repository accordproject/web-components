import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import { Popup } from 'semantic-ui-react';
import { BUTTON_COLORS, POPUP_STYLE } from '../utilities/constants';
import Button from '../components/Button';

const FormatButton = ({
  toggleFunc,
  type,
  label,
  icon,
  ...props
}) => {
  const editor = useSlate();
  const handleMouseDown = (e) => {
    e.preventDefault();
    toggleFunc(editor, type);
  };

  return (
    <Popup
      content={label}
      style={POPUP_STYLE}
      position='bottom center'
      trigger={
          <Button
              aria-label={type}
              onMouseDown={handleMouseDown}
              background={BUTTON_COLORS.BACKGROUND_INACTIVE}
              {...props}
          >
              {icon(BUTTON_COLORS.SYMBOL_INACTIVE)}
          </ Button>
      }
    />
  );
};

FormatButton.propTypes = {
  toggleFunc: PropTypes.func,
  activeFunc: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
};

export default FormatButton;
