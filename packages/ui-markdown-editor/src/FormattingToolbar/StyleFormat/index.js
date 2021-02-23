import React from 'react';
import PropTypes from 'prop-types';
import { Node } from 'slate';
import { useEditor } from 'slate-react';
import { Dropdown } from 'semantic-ui-react';
import StyleDropdownItem from './Item';
import {
  BLOCK_STYLE,
  DROPDOWN_STYLE,
  DROPDOWN_STYLE_H1,
  DROPDOWN_STYLE_H2,
  DROPDOWN_STYLE_H3,
} from '../../utilities/constants';
import {
  PARAGRAPH, H1, H2, H3
} from '../../utilities/schema';

const StyleDropdown = ({ canBeFormatted }) => {
  const editor = useEditor();
  const currentBlock = (editor && editor.selection)
    ? BLOCK_STYLE[Node.parent(editor, editor.selection.focus.path).type]
    : 'Style';
  return (
    <Dropdown
        simple
        openOnFocus
        text={currentBlock}
        style={DROPDOWN_STYLE}
      >
        <Dropdown.Menu>
          <StyleDropdownItem
            editor={editor}
            type={PARAGRAPH}
            style={null}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H1}
            style={DROPDOWN_STYLE_H1}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H2}
            style={DROPDOWN_STYLE_H2}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H3}
            style={DROPDOWN_STYLE_H3}
            canBeFormatted={canBeFormatted}
          />
        </Dropdown.Menu>
      </Dropdown>);
};

StyleDropdown.propTypes = {
  canBeFormatted: PropTypes.func
};

export default StyleDropdown;
