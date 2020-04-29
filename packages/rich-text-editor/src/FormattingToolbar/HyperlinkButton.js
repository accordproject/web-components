import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { useEditor } from 'slate-react';
import { BUTTON_COLORS, POPUP_STYLE } from '../utilities/constants';
import Button from '../components/Button';


// eslint-disable-next-line react/display-name
const HyperlinkButton = React.forwardRef(
  ({
    showLinkModal,
    setShowLinkModal,
    type,
    label,
    icon,
    canBeFormatted,
    ...props
  }, ref) => {
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
      position='bottom center'
      trigger={
          <Button
              ref={ref}
              aria-label={type}
              onMouseDown={onMouseDown}
              isActive={isActive}
              background={backgroundColor}
              {...props}
          >
              {icon(iconColor)}
          </ Button>
      }
    />
    );
  }
);

HyperlinkButton.propTypes = {
  showLinkModal: PropTypes.func,
  setShowLinkModal: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
  ref: PropTypes.any,
  canBeFormatted: PropTypes.func,
};

export default HyperlinkButton;
