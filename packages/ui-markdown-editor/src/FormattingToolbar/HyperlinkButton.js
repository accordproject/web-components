import React from 'react';
import PropTypes from 'prop-types';
import {Popup} from 'semantic-ui-react';
import {useEditor} from 'slate-react';
import {BUTTON_COLORS, POPUP_STYLE} from '../utilities/constants';
import Button from '../components/Button';

const HyperlinkButton = ({
  showLinkModal,
  setShowLinkModal,
  type,
  label,
  icon,
  canBeFormatted,
  activeButton,
  ...props
}) => {
  const isActive = showLinkModal;
  const iconColor = isActive
    ? activeButton.symbol
    : BUTTON_COLORS.SYMBOL_INACTIVE;
  const backgroundColor = isActive
    ? activeButton.background
    : BUTTON_COLORS.BACKGROUND_INACTIVE;

  const editor = useEditor();
  /**
   * Shows the modal on mouse click if the document is in editable mode.
   */
  const onMouseDown = () => {
    if (!canBeFormatted(editor)) return;
    if (editor.selection) setShowLinkModal(true);
  };

  return (
    <Popup
      content={label}
      style={POPUP_STYLE}
      position="bottom center"
      trigger={
        <Button
          aria-label={type}
          onMouseDown={onMouseDown}
          isActive={isActive}
          background={backgroundColor}
          {...props}>
          {icon(iconColor)}
        </Button>
      }
    />
  );
};

HyperlinkButton.displayName = 'HyperlinkButton';

HyperlinkButton.propTypes = {
  showLinkModal: PropTypes.bool,
  setShowLinkModal: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
  ref: PropTypes.any,
  canBeFormatted: PropTypes.func,
  activeButton: PropTypes.object,
};

export default HyperlinkButton;
