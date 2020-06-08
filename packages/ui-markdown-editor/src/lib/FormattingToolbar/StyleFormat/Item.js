import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { BLOCK_STYLE } from '../../utilities/constants';
import { toggleBlock } from '../../utilities/toolbarHelpers';

const StyleDropdownItem = ({
  editor, type, style, canBeFormatted
}) => (
    <Dropdown.Item
        text={BLOCK_STYLE[type]}
        style={style}
        onMouseDown={(event) => {
          event.preventDefault();
          if (!canBeFormatted(editor)) return;
          toggleBlock(editor, type);
        }}
    />
);

StyleDropdownItem.propTypes = {
  editor: PropTypes.object,
  type: PropTypes.string,
  style: PropTypes.object,
  canBeFormatted: PropTypes.func
};

export default StyleDropdownItem;
