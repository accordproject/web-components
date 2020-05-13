import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { useEditor } from 'slate-react';
import { BUTTON_COLORS, POPUP_STYLE } from '../utilities/constants';
import Button from '../components/Button';

const HyperlinkButton = ({
  showLinkModal,
  setShowLinkModal,
  type,
  label,
  icon,
  canBeFormatted,
  ...props
}) => {
  const isActive = showLinkModal;
  const iconColor = isActive
    ? BUTTON_COLORS.HYPERLINK_ACTIVE
    : BUTTON_COLORS.SYMBOL_INACTIVE;
  const backgroundColor = isActive
    ? BUTTON_COLORS.BACKGROUND_ACTIVE
    : BUTTON_COLORS.BACKGROUND_INACTIVE;

  const editor = useEditor();
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
  canBeFormatted: PropTypes.func,
};

export default HyperlinkButton;
