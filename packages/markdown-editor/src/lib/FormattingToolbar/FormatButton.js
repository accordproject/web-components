import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import { Popup } from 'semantic-ui-react';
import { BUTTON_COLORS, POPUP_STYLE } from '../utilities/constants';
import Button from '../components/Button';

const FormatButton = ({
  toggleFunc,
  activeFunc,
  type,
  label,
  icon,
  canBeFormatted,
  ...props
}) => {
  const editor = useSlate();
  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!canBeFormatted(editor)) return;
    toggleFunc(editor, type);
  };
  const isActive = activeFunc(editor, type);
  const iconColor = isActive
    ? BUTTON_COLORS.SYMBOL_ACTIVE
    : BUTTON_COLORS.SYMBOL_INACTIVE;
  const backgroundColor = isActive
    ? BUTTON_COLORS.BACKGROUND_ACTIVE
    : BUTTON_COLORS.BACKGROUND_INACTIVE;

  return (
    <Popup
      content={label}
      style={POPUP_STYLE}
      position='bottom center'
      trigger={
          <Button
              aria-label={type}
              onMouseDown={handleMouseDown}
              isActive={isActive}
              background={backgroundColor}
              {...props}
          >
              {icon(iconColor)}
          </ Button>
      }
    />
  );
};

FormatButton.propTypes = {
  toggleFunc: PropTypes.func,
  activeFunc: PropTypes.func,
  canBeFormatted: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
};

export default FormatButton;
