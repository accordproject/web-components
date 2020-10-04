import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';
import { Editor, Transforms, Node } from 'slate';
import styled from 'styled-components';
import { Form, Input, Popup } from 'semantic-ui-react';

import { insertLink, isSelectionLink, unwrapLink } from '../plugins/withLinks';
import Portal from '../components/Portal';

import CopyIcon from '../components/icons/copy';
import OpenIcon from '../components/icons/open';
import DeleteIcon from '../components/icons/delete';

const HyperlinkWrapper = styled.div`
    position: absolute;
    z-index: 3000;
    top: -10000px;
    left: -10000px;
    margin-top: -6px;
    opacity: 0;
    background-color: #FFFFFF;
    border: 1px solid #d4d4d5;
    border-radius: .3rem;
    transition: opacity 0.75s;

    min-width: min-content;
    line-height: 1.4285em;
    max-width: 250px;
    padding: .833em 1em;
    font-weight: 400;
    font-style: normal;
    color: rgba(0,0,0,.87);
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    & > * {
        display: inline-block;
    }
`;

const HyperlinkCaret = styled.div`
    position: absolute;
    z-index: 4000;
    left: calc(50% - 5px);
    top: -10px;
    height: 0;
    width: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #d4d4d5;
    transition: opacity 0.75s;
`;

const LinkIconHolder = styled.div`
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: -2px 3px;
  margin: 0 3px;
  &:hover {
    background-color: #eee;
  }
`;

const InlineFormField = styled(Form.Field)`
  display: flex;
  flex-direction: row;
`;

const InputFieldWrapper = styled.div`
  width: 270px;
  display: flex;
  flex-direction: column;
`;

const InputFieldLabel = styled.label`
  font-weight: bold;
  font-size: 12px;
`;

const InlineFormButton = styled.button`
  margin-left: 10px;
  align-self: flex-end;
  height: 38px;
  width: 90px;
  border: none;
  color: #fff;
  border-radius: 3px;
  background-color: #0043BA;
  &:hover {
    background-color: #265FC4;
  }
`;

const LinkCoppiedMessage = styled.span`
  color: green;
  line-height: 25px;
  margin-left: 10px;
`;

const popupStyles = {
  padding: '0.2em 0.5em 0.2em 0.5em',
  zIndex: '9999'
};

// eslint-disable-next-line react/display-name
const HyperlinkMenu = React.forwardRef(
  ({ ...props }, ref) => <HyperlinkWrapper ref={ref} {...props} />
);

HyperlinkMenu.displayName = 'HyperlinkMenu';

// eslint-disable-next-line react/display-name
const HyperlinkModal = React.forwardRef(({ ...props }, ref) => {
  const refHyperlinkTextInput = useRef();
  const editor = useEditor();
  const [originalSelection, setOriginalSelection] = useState(null);
  const [canApply, setApplyStatus] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setLinkCopied(false),
      3000
    );
    return () => clearTimeout(timer);
  }, [linkCopied]);

  const handleClick = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      props.setShowLinkModal(false);
    }
  }, [props, ref]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick]);

  const defaultTextValue = React.useMemo(() => {
    try {
      if (isSelectionLink(editor)) {
        const linkNode = Node.parent(editor, editor.selection.focus.path);
        return Editor.string(editor, ReactEditor.findPath(editor, linkNode));
      }
      return Editor.string(editor, editor.selection);
    } catch (err) {
      return '';
    }
  }, [editor]);

  const defaultLinkValue = (editor.selection && isSelectionLink(editor))
    ? Node.parent(editor, editor.selection.focus.path).data.href
    : '';

  useEffect(() => {
    // If the form is just opened, focus the Url input field
    if (props.showLinkModal) {
      setOriginalSelection(editor.selection);
      setApplyStatus(!!refHyperlinkTextInput.current.props.defaultValue);
      const x = window.scrollX;
      const y = window.scrollY;
      refHyperlinkTextInput.current.focus();
      window.scrollTo(x, y);
    }
  }, [editor, props.showLinkModal]);

  const removeLink = () => {
    Transforms.select(editor, originalSelection);
    unwrapLink(editor);
    Transforms.deselect(editor);
    ReactEditor.focus(editor);
    props.setShowLinkModal(false);
  };

  const validateUrl = (url) => {
    const isUrlInvalid = !(url.startsWith('http://') || url.startsWith('https://'));
    if (isUrlInvalid) {
      return `https://${url}`;
    }
    return url;
  };

  const applyLink = (event) => {
    const newUrl = validateUrl(event.target.url.value);
    Transforms.select(editor, originalSelection);
    insertLink(editor, newUrl, event.target.text.value);
    Transforms.collapse(editor, { edge: 'end' });
    ReactEditor.focus(editor);
    props.setShowLinkModal(false);
  };

  const handleUrlInput = (event) => {
    Transforms.select(editor, originalSelection);
    setApplyStatus(!!event.target.value);
  };

  const copyLink = () => {
    const inputLink = refHyperlinkTextInput.current.inputRef.current.value;
    const listener = (e) => {
      e.clipboardData.setData('text/plain', inputLink);
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    setLinkCopied(true);
  };

  const openLink = () => {
    const inputLink = refHyperlinkTextInput.current.inputRef.current.value;
    if (inputLink) {
      window.open(inputLink, '_blank');
    }
  };

  return (
    <Portal>
      <HyperlinkMenu ref={ref}>
        <HyperlinkCaret />
        <Form onSubmit={applyLink}>
          <InputFieldWrapper>
              <InputFieldLabel>Link Text</InputFieldLabel>
              <Input placeholder="Text" name="text"
                defaultValue={defaultTextValue}
              />
          </InputFieldWrapper>
          <InlineFormField>
              <InputFieldWrapper>
                <InputFieldLabel>Link URL</InputFieldLabel>
                <Input
                  ref={refHyperlinkTextInput}
                  placeholder={'http://example.com'}
                  defaultValue={defaultLinkValue}
                  onChange={handleUrlInput}
                  name="url"
                />
              </InputFieldWrapper>
              <InlineFormButton
                type="submit"
                disabled={!canApply}
              >
                Apply
              </InlineFormButton>
          </InlineFormField>
          <InlineFormField>
              <Popup
                trigger={
                  <LinkIconHolder
                    onClick={copyLink}
                    aria-label="Copy hyperlink text"
                  >
                    <CopyIcon />
                  </LinkIconHolder>
                }
                content="Copy hyperlink text"
                inverted
                position='bottom left'
                style={popupStyles}
              />
              <Popup
                trigger={
                  <LinkIconHolder
                    onClick={removeLink}
                    aria-label="Remove hyperlink"
                  >
                    <DeleteIcon />
                  </LinkIconHolder>
                }
                content="Remove hyperlink"
                inverted
                position='bottom left'
                style={popupStyles}
              />
              <Popup
                trigger={
                  <LinkIconHolder
                    onClick={openLink}
                    aria-label="Open hyperlink"
                  >
                    <OpenIcon />
                  </LinkIconHolder>
                }
                content="Open link in a new tab"
                inverted
                position='bottom left'
                style={popupStyles}
              />
            {linkCopied && <LinkCoppiedMessage>Link copied</LinkCoppiedMessage>}
          </InlineFormField>
        </Form>
      </HyperlinkMenu>
    </Portal>
  );
});

HyperlinkModal.displayName = 'HyperlinkModal';

HyperlinkModal.propTypes = {
  setShowLinkModal: PropTypes.func,
  showLinkModal: PropTypes.bool
};

export default HyperlinkModal;
