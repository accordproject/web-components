import React, {
  useCallback, useMemo, useState
} from 'react';
import { CiceroMarkTransformer } from '@accordproject/markdown-cicero';
import { HtmlTransformer } from '@accordproject/markdown-html';
import { SlateTransformer } from '@accordproject/markdown-slate';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
import { Editor, Range, createEditor, Transforms, Node } from 'slate';
import { withHistory } from 'slate-history';
import PropTypes from 'prop-types';
import HOTKEYS, { formattingHotKeys } from './utilities/hotkeys';
import { BUTTON_ACTIVE, BLOCK_STYLE } from './utilities/constants';
import withSchema from './utilities/schema';
import Element from './components';
import Leaf from './components/Leaf';
import { toggleMark, toggleBlock, insertThematicBreak,
  insertLinebreak, insertHeadingbreak, isBlockHeading } from './utilities/toolbarHelpers';
import { withImages, insertImage } from './plugins/withImages';
import { withLinks, isSelectionLinkBody } from './plugins/withLinks';
import { withHtml } from './plugins/withHtml';
import { withLists } from './plugins/withLists';
import FormatBar from './FormattingToolbar';
import { withText } from './plugins/withText';

export const markdownToSlate = (markdown) => {
  const slateTransformer = new SlateTransformer();
  return slateTransformer.fromMarkdown(markdown);
};

export const MarkdownEditor = (props) => {
  const {
    canCopy,
    canKeyDown,
    augmentEditor,
    isEditable,
    canBeFormatted
  } = props;
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('');
  const editor = useMemo(() => {
    if (augmentEditor) {
      return augmentEditor(
        withLists(withLinks(withHtml(withImages(withText(
          withSchema(withHistory(withReact(createEditor())))
        )))))
      );
    }
    return withLists(withLinks(withHtml(withImages(withText(
      withSchema(withHistory(withReact(createEditor())))
    )))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Renders the leaf component into the document.
   */
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  /**
   * Renders the elements into the document.
   */
  const renderElement = useCallback((slateProps) => {
    const elementProps = { ...slateProps, customElements: props.customElements, editor };
    return (<Element {...elementProps} />);
  }, [props.customElements, editor]);

  /**
   * Hotkey/Shortucy key functions for different actions
   */
  const hotkeyActions = {
    mark: code => toggleMark(editor, code),
    block: code => toggleBlock(editor, code),
    image: () => {
      const url = window.prompt('Enter the URL of the image:');
      if (url) {
        insertImage(editor, url);
      }
    },
    special: (code) => {
      if (code === 'undo') return editor.undo();
      return editor.redo();
    },
    link: () => {
      setShowLinkModal(true);
    },
    horizontal_rule: (code) => insertThematicBreak(editor, code),
    linebreak: (code) => insertLinebreak(editor, code),
    headingbreak: () => insertHeadingbreak(editor)
  };

  /**
   * Calls the corresponding function on key down.
   */
  const onKeyDown = useCallback((event) => {
    if (!canKeyDown(editor, event)) {
      event.preventDefault();
      return;
    }

    const [imageNode] = Editor.nodes(editor, { match: n => n.type === 'image' });

    // handle specific case to delete image when backspace is pressed
    if(event.keyCode===8 && imageNode){
      Editor.deleteBackward(editor);
      return ;
    }

    // handle specific case to delete image when delete is pressed
    if(event.keyCode===46 && imageNode){
      Editor.deleteForward(editor);
      return ;
    }

    const isFormatEvent = () => formattingHotKeys.some(hotkey => isHotkey(hotkey, event));
    if (!canBeFormatted(editor) && isFormatEvent()) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' && !isBlockHeading(editor)) {
      return;
    }

    const hotkeys = Object.keys(HOTKEYS);
    hotkeys.forEach((hotkey) => {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const { code, type } = HOTKEYS[hotkey];
        hotkeyActions[type](code);
      }
    });
  }, [canBeFormatted, canKeyDown, editor, hotkeyActions]);

  /**
   * Ensures that the editor is editable before changing the document. If editor isn't editable, then nothing is done.
   */
  const onBeforeInput = useCallback((event) => {
    const canEdit = isEditable(editor, event);
    if (!canEdit) {
      event.preventDefault();
    }
  }, [editor, isEditable]);

  /**
   * Calls the corresponding fucntions when copy or cut is performed.
   */
  const handleCopyOrCut = useCallback((event, cut) => {
    event.preventDefault();
    if (!canCopy(editor)) return;
    const slateTransformer = new SlateTransformer();
    const htmlTransformer = new HtmlTransformer();
    const ciceroMarkTransformer = new CiceroMarkTransformer();
    const SLATE_CHILDREN = Node.fragment(editor, editor.selection);
    const SLATE_DOM = {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        children: SLATE_CHILDREN
      }
    };
    const CICERO_MARK_DOM = slateTransformer.toCiceroMark(SLATE_DOM);
    const HTML_DOM = htmlTransformer.toHtml(CICERO_MARK_DOM);
    const MARKDOWN_TEXT = ciceroMarkTransformer.toMarkdown(CICERO_MARK_DOM);
    const [imageNode] = Editor.nodes(editor, { match: n => n.type === 'image' });

    event.clipboardData.setData('text/html', HTML_DOM);
    event.clipboardData.setData('text/plain', MARKDOWN_TEXT);

    if (cut && imageNode) {
      Editor.deleteBackward(editor);
    }

    if (cut && editor.selection && Range.isExpanded(editor.selection)) {
      Editor.deleteFragment(editor);
    }
  }, [canCopy, editor]);

  /**
   * Updates the style block and executes the corresponding function whenever the document changes.
   * 
   * @param {Object} value Properties and value of the document.
   */
  const onChange = (value) => {
    try {
      if (props.readOnly) return;
      props.onChange(value, editor);
      const { selection } = editor;
      if (selection && isSelectionLinkBody(editor)) {
        setShowLinkModal(true);
      }
      const currentStyleCalculated = BLOCK_STYLE[Node.parent(editor, editor.selection.focus.path).type] || 'Style';
      setCurrentStyle(currentStyleCalculated);
    } catch (err) {
      console.log('Caught exception within markdown-editor onChange', err);
    }
  };

  /**
   * Executes the function whenever an item is dragged
   * 
   * @param {MouseEvent} event Mouse Drag
   */
  const handleDragStart = (event) => {
    event.stopPropagation();
    if (props.onDragStart) {
      props.onDragStart(editor, event);
    }
    const node = ReactEditor.toSlateNode(editor, event.target);
    const path = ReactEditor.findPath(editor, node);
    const range = Editor.range(editor, path);
    event.dataTransfer.setData('text', JSON.stringify(range));
  };

  /**
   * Changes the position of the dragged item.
   * 
   * @param {MouseEvent} event Mouse Drop
   */
  const handleDrop = (event) => {
    event.preventDefault();
    if (props.onDrop) {
      const shouldContinue = props.onDrop(editor, event);
      if (!shouldContinue) return;
    }
    const sourceRange = JSON.parse(event.dataTransfer.getData('text'));
    const [imageNode] = Editor.nodes(editor, { match: n => n.type === 'image', at: sourceRange });
    const targetRange = ReactEditor.findEventRange(editor, event);
    if (imageNode) {
      Transforms.select(editor, targetRange);
      Transforms.collapse(editor);
      Transforms.removeNodes(editor, { at: sourceRange, match: n => n.type === 'image' });
      Transforms.insertNodes(editor, imageNode[0]);
    }
  };

  return (
    <Slate editor={editor} value={props.value} onChange={onChange} >
      { !props.readOnly
        && <FormatBar
        currentStyle={currentStyle}
        canBeFormatted={props.canBeFormatted}
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        activeButton={props.activeButton || BUTTON_ACTIVE}
        /> }
      <Editable
        id="ap-rich-text-editor"
        style={{
          padding: '0px 20px 10px 20px',
          border: '1px solid grey',
          borderRadius: '4px',
          minWidth: '600px'
        }}
        readOnly={props.readOnly}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={props.placeholder || 'Enter some text here...'}
        spellCheck
        autoFocus
        onKeyDown={onKeyDown}
        onDOMBeforeInput={onBeforeInput}
        onCopy={handleCopyOrCut}
        onCut={event => handleCopyOrCut(event, true)}
        onDragStart={handleDragStart}
        onDragOver={event => props.onDragOver ? props.onDragOver(editor, event) : null}
        onDrop={handleDrop}
      />
    </Slate>
  );
};

/**
 * The property types for this component
 */
MarkdownEditor.propTypes = {
  /* Initial contents for the editor (markdown text) */
  value: PropTypes.array.isRequired,
  /* A callback that receives the markdown text */
  onChange: PropTypes.func.isRequired,
  /* Boolean to make editor read-only (uneditable) or not (editable) */
  readOnly: PropTypes.bool,
  /* Higher order function to augment the editor methods */
  augmentEditor: PropTypes.func,
  /* Function for extending elements rendered by editor */
  customElements: PropTypes.func,
  /* A method that determines if current edit should be allowed */
  isEditable: PropTypes.func,
  /* A method that determines if current formatting change should be allowed */
  canBeFormatted: PropTypes.func,
  /* A method that determines if current selection copy should be allowed */
  canCopy: PropTypes.func,
  /* A method that determines if current key event should be allowed */
  canKeyDown: PropTypes.func,
  /* Placeholder text when the editor is blank */
  placeholder: PropTypes.string,
  /* Optional object to change formatting button active state color */
  activeButton: PropTypes.object,
  /* Optional function to call when onDragStart event fires which will receive editor and event */
  onDragStart: PropTypes.func,
  /* Optional function to call when onDrop event fires which will receive editor and event */
  onDrop: PropTypes.func,
  /* Optional function to call when onDragOver event fires which will receive editor and event */
  onDragOver: PropTypes.func,
  /* Tells the current style of text block that the cursor is on and updates onChange */
  currentStyle: PropTypes.string,
};

MarkdownEditor.defaultProps = {
  isEditable: () => true,
  canBeFormatted: () => true,
  canCopy: () => true,
  canKeyDown: () => true,
};
