import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import { Popup } from 'semantic-ui-react';
import { POPUP_STYLE } from '../utilities/constants';
import Button from '../components/Button';

const InsertButton = ({
  toggleFunc,
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

  return (
    <Popup
      content={label}
      style={POPUP_STYLE}
      position='bottom center'
      trigger={
          <Button
              aria-label={type}
              onMouseDown={handleMouseDown}
              {...props}
          >
              {icon()}
          </ Button>
      }
    />
  );
};

InsertButton.propTypes = {
  toggleFunc: PropTypes.func,
  canBeFormatted: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
};

export default InsertButton;
