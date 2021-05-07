import React from 'react';
import PropTypes from 'prop-types';
import { useEditor } from 'slate-react';
import { Dropdown } from 'semantic-ui-react';
import StyleDropdownItem from './Item';
import {
  DROPDOWN_STYLE,
  TOOLBAR_DROPDOWN_STYLE_H1,
  TOOLBAR_DROPDOWN_STYLE_H2,
  TOOLBAR_DROPDOWN_STYLE_H3,
  TOOLBAR_DROPDOWN_STYLE_H4,
  TOOLBAR_DROPDOWN_STYLE_H5,
  TOOLBAR_DROPDOWN_STYLE_H6,
} from '../../utilities/constants';
import {
  PARAGRAPH, H1, H2, H3, H4, H5, H6
} from '../../utilities/schema';

const StyleDropdown = ({ canBeFormatted, currentStyle }) => {
  const editor = useEditor();
  const onMouseDownHandler = (event) => {
    event.preventDefault();
    if (!canBeFormatted(editor)) return;
  }

  const currentBlock = currentStyle;
  return (
    <Dropdown
        simple
        openOnFocus
        onMouseDown={onMouseDownHandler}
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
            style={TOOLBAR_DROPDOWN_STYLE_H1}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H2}
            style={TOOLBAR_DROPDOWN_STYLE_H2}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H3}
            style={TOOLBAR_DROPDOWN_STYLE_H3}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H4}
            style={TOOLBAR_DROPDOWN_STYLE_H4}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H5}
            style={TOOLBAR_DROPDOWN_STYLE_H5}
            canBeFormatted={canBeFormatted}
          />
          <StyleDropdownItem
            editor={editor}
            type={H6}
            style={TOOLBAR_DROPDOWN_STYLE_H6}
            canBeFormatted={canBeFormatted}
          />
        </Dropdown.Menu>
      </Dropdown>);
};

StyleDropdown.propTypes = {
  canBeFormatted: PropTypes.func,
  currentStyle: PropTypes.string,
};

export default StyleDropdown;
