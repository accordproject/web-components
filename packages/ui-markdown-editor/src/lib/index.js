import React, {
  useCallback, useMemo, useState
} from 'react';
import { CiceroMarkTransformer } from '@accordproject/markdown-cicero';
import { HtmlTransformer } from '@accordproject/markdown-html';
import { SlateTransformer } from '@accordproject/markdown-slate';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
import { Editor, Range, Node, createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import PropTypes from 'prop-types';
import HOTKEYS, { formattingHotKeys } from './utilities/hotkeys';
import { BUTTON_ACTIVE } from './utilities/constants';
import withSchema from './utilities/schema';
import Element from './components';
import Leaf from './components/Leaf';
import { toggleMark, toggleBlock, insertThematicBreak } from './utilities/toolbarHelpers';
import { withImages, insertImage } from './plugins/withImages';
import { withLinks, isSelectionLinkBody } from './plugins/withLinks';
import { withHtml } from './plugins/withHtml';
import { withLists } from './plugins/withLists';
import FormatBar from './FormattingToolbar';

export const markdownToSlate = (markdown) => {
  const slateTransformer = new SlateTransformer();
  return slateTransformer.fromMarkdown(markdown);
};

export const MarkdownEditor = (props) => {
  const {
    canCopy,
    canKeyDown,
    augmentEditor,
    customDecorate,
    isEditable,
    canBeFormatted
  } = props;
  const [showLinkModal, setShowLinkModal] = useState(false);
  const editor = useMemo(() => {
    if (augmentEditor) {
      return augmentEditor(
        withLists(withLinks(withHtml(withImages(
          withSchema(withHistory(withReact(createEditor())))
        ))))
      );
    }
    return withLists(withLinks(withHtml(withImages(
      withSchema(withHistory(withReact(createEditor())))
    ))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback((slateProps) => {
    const elementProps = { ...slateProps, customElements: props.customElements, editor };
    return (<Element {...elementProps} />);
  }, [props.customElements, editor]);

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
  };

  const onKeyDown = useCallback((event) => {
    if (!canKeyDown(editor, event)) {
      event.preventDefault();
      return;
    }
    const isFormatEvent = () => formattingHotKeys.some(hotkey => isHotkey(hotkey, event));
    if (!canBeFormatted(editor) && isFormatEvent()) {
      event.preventDefault();
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

  const onBeforeInput = useCallback((event) => {
    const canEdit = isEditable(editor, event);
    if (!canEdit) {
      event.preventDefault();
    }
  }, [editor, isEditable]);

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

    event.clipboardData.setData('text/html', HTML_DOM);
    event.clipboardData.setData('text/plain', MARKDOWN_TEXT);

    if (cut && editor.selection && Range.isExpanded(editor.selection)) {
      Editor.deleteFragment(editor);
    }
  }, [canCopy, editor]);

  const onChange = (value) => {
    if (props.readOnly) return;
    props.onChange(value, editor);
    const { selection } = editor;
    if (selection && isSelectionLinkBody(editor)) {
      setShowLinkModal(true);
    }
  };

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

  const decorate = useCallback(([node, path]) => customDecorate([node, path]), [customDecorate]);

  return (
    <Slate editor={editor} value={props.value} onChange={onChange}>
      { !props.readOnly
        && <FormatBar
        canBeFormatted={props.canBeFormatted}
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        activeButton={props.activeButton || BUTTON_ACTIVE}
        /> }
      <Editable
        id="ap-rich-text-editor"
        style={{ padding: '20px' }}
        decorate={decorate}
        readOnly={props.readOnly}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={props.placeholder || 'Enter some rich text...'}
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
  /* Function for extending editor decoration capabilities */
  customDecorate: PropTypes.func,
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
};

MarkdownEditor.defaultProps = {
  isEditable: () => true,
  canBeFormatted: () => true,
  canCopy: () => true,
  canKeyDown: () => true,
  customDecorate: () => [],
};
