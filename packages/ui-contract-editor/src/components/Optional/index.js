/* React */
import React, { useState } from 'react';
import { Editor, Transforms, Node } from 'slate';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';

/* Plugins */
import { OPTIONAL, VARIABLE } from '../../ContractEditor/plugins/withClauseSchema';

/* Components */
import OptionalBoolean from './OptionalBoolean';
import OptionalSwitch from './OptionalSwitch';

/**
 * Component to render an inline optional node
 * This will have an id property of the Slate key
 * @param {*} props
 */
const Optional = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    children: { props: { node } },
    children: { props: { node: { data } } },
  } = props;
  const editor = useEditor();
  const [hovering, setHovering] = useState(false);
  const optionalPath = ReactEditor.findPath(editor, node);
  const isNotReadOnly = !props.readOnly;
  const isContentShowing = !!Node.string(node).length;
  const optionalReverse = {
    object: 'inline',
    type: OPTIONAL,
    data: {
      name: data.name,
      whenSome: data.whenSome,
      whenNone: data.whenNone,
      hasSome: !data.hasSome,
    },
    children: data.hasSome ? data.whenNone : data.whenSome
  };

  const isOptionalVariable = (target) => {
    const TARGET_NODE = ReactEditor.toSlateNode(editor, target);
    const TARGET_PATH = ReactEditor.findPath(editor, TARGET_NODE);
    // eslint-disable-next-line no-restricted-syntax
    for (const [currNode] of Node.ancestors(editor, TARGET_PATH, { reverse: true })) {
      if (currNode.type === VARIABLE) return true;
    }
    return false;
  };

  const swapOptional = (path) => {
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(editor, optionalReverse, { at: path });
    });
  };

  const toggleOptional = (path, target) => {
    if (!target || !isOptionalVariable(target)) {
      swapOptional(path);
    }
  };

  const handleMouseEnter = (target) => {
    if (target.className === OPTIONAL) { setHovering(true); }
    if (target.className === VARIABLE) { setHovering(false); }
  };

  const optionalProps = {
    id: data.name,
    className: isContentShowing ? OPTIONAL : '',
    onMouseEnter: (e) => handleMouseEnter(e.target),
    onMouseLeave: () => setHovering(false),
    onClick: (e) => toggleOptional(optionalPath, e.target),
    ...attributes,
    ref
  };

  const optionalSwitchProps = {
    currentHover: hovering,
    isContentShowing,
    ...data,
  };
  const optionalIconProps = {
    currentHover: hovering,
    whenSome: Node.string(optionalReverse),
    toggleOptional: () => toggleOptional(optionalPath),
  };

  return (
    <span {...attributes}>
    { isNotReadOnly && (isContentShowing
      ? <OptionalSwitch {...optionalSwitchProps} />
      : <OptionalBoolean {...optionalIconProps} />) }
        <span {...optionalProps}>{children}</span>
    </span>
  );
});

Optional.displayName = 'Optional';

Optional.propTypes = {
  attributes: PropTypes.PropTypes.shape({
    'data-key': PropTypes.string,
  }),
  children: PropTypes.object.isRequired,
  editor: PropTypes.any,
  node: PropTypes.shape({
    data: PropTypes.obj,
  }),
  readOnly: PropTypes.bool,
};

export default Optional;
