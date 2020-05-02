import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';

import { InsertImageButton } from '../plugins/withImages';
import ToolbarMenu from './ToolbarMenu';
import FormatButton from './FormatButton';
import HistoryButton from './HistoryButton';
import HyperlinkButton from './HyperlinkButton';
import StyleDropdown from './StyleFormat';
import HyperlinkModal from './HyperlinkModal';
import {
  toggleBlock, isBlockActive,
  toggleMark, isMarkActive,
  toggleHistory
} from '../utilities/toolbarHelpers';
import {
  bold, italic, code,
  quote, olist, ulist,
  image, link, undo, redo,
  Separator
} from '../components/icons';

const mark = { toggleFunc: toggleMark, activeFunc: isMarkActive };
const block = { toggleFunc: toggleBlock, activeFunc: isBlockActive };
const history = { toggleFunc: toggleHistory };

const FormattingToolbar = ({ canBeFormatted, showLinkModal, setShowLinkModal }) => {
  const editor = useEditor();
  const linkModalRef = useRef();
  const linkButtonRef = useRef();

  const linkProps = {
    showLinkModal,
    setShowLinkModal
  };

  useEffect(() => {
    if (showLinkModal) {
      const el = linkModalRef.current;
      const domRange = ReactEditor.toDOMRange(editor, editor.selection);
      const rect = domRange.getBoundingClientRect();
      const CARET_TOP_OFFSET = 15;
      el.style.opacity = 1;
      el.style.top = `${rect.top + rect.height + window.pageYOffset + CARET_TOP_OFFSET}px`;
      el.style.left = `${rect.left
          + window.pageXOffset
          - el.offsetWidth / 2
          + rect.width / 2}px`;
    }
  }, [editor, showLinkModal]);


  return (
    <ToolbarMenu className="ap-rich-text-editor-toolbar">
      <StyleDropdown canBeFormatted={canBeFormatted}/>
      <Separator />
      <FormatButton {...mark} {...bold} canBeFormatted={canBeFormatted} />
      <FormatButton {...mark} {...italic} canBeFormatted={canBeFormatted} />
      <FormatButton {...mark} {...code} canBeFormatted={canBeFormatted} />
      <Separator />
      <FormatButton {...block} {...quote} canBeFormatted={canBeFormatted} />
      <FormatButton {...block} {...olist} canBeFormatted={canBeFormatted} />
      <FormatButton {...block} {...ulist} canBeFormatted={canBeFormatted} />
      <Separator />
      <HistoryButton {...history} {...undo} />
      <HistoryButton {...history} {...redo} />
      <Separator />
      <HyperlinkButton
        ref={linkButtonRef}
        {...linkProps}
        {...link}
        canBeFormatted={canBeFormatted}
      />
      <InsertImageButton {...image} canBeFormatted={canBeFormatted} />
      { showLinkModal && <HyperlinkModal ref={linkModalRef} {...linkProps} /> }
    </ToolbarMenu>
  );
};

FormattingToolbar.propTypes = {
  canBeFormatted: PropTypes.func,
  showLinkModal: PropTypes.string,
  setShowLinkModal: PropTypes.func,
};


export default FormattingToolbar;
