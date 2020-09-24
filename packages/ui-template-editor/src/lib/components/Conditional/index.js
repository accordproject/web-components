/* React */
import React, { useState } from 'react';
import { Editor, Transforms } from 'slate';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';

/* Plugins */
import { CONDITIONAL } from '../../TemplateEditor/plugins/withClauseSchema';

/* Actions */
import { childReducer } from '../actions';

/* Components */
import ConditionalBoolean from './ConditionalBoolean';
import ConditionalSwitch from './ConditionalSwitch';

/**
 * Component to render an inline conditional node
 * This will have an id property of the Slate key
 * @param {*} props
 */
const Conditional = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    children: { props: { node } },
    children: { props: { node: { data } } },
  } = props;
  const editor = useEditor();
  const [hovering, setHovering] = useState(false);
  const conditionalPath = ReactEditor.findPath(editor, node);
  const isNotReadOnly = !props.readOnly;
  const isContentShowing = data.isTrue
    ? !!childReducer(data.whenTrue).length
    : !!childReducer(data.whenFalse).length;

  const toggleConditional = (path) => {
    const newConditional = {
      object: 'inline',
      type: CONDITIONAL,
      data: {
        name: data.name,
        whenTrue: data.whenTrue,
        whenFalse: data.whenFalse,
        isTrue: !data.isTrue,
      },
      children: data.isTrue ? data.whenFalse : data.whenTrue
    };
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(editor, newConditional, { at: path });
    });
  };

  const conditionalProps = {
    id: data.name,
    className: isContentShowing ? CONDITIONAL : '',
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    onClick: () => toggleConditional(conditionalPath),
    ...attributes,
    ref
  };

  const conditionalSwitchProps = {
    currentHover: hovering,
    isContentShowing,
    ...data,
  };
  const conditionalIconProps = {
    currentHover: hovering,
    whenTrue: childReducer(data.whenTrue),
    toggleConditional: () => toggleConditional(conditionalPath),
  };

  return (
    <span {...attributes}>
    { isNotReadOnly && (isContentShowing
      ? <ConditionalSwitch {...conditionalSwitchProps} />
      : <ConditionalBoolean {...conditionalIconProps} />) }
        <span {...conditionalProps}>{children}</span>
    </span>
  );
});

Conditional.displayName = 'Conditional';

Conditional.propTypes = {
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

export default Conditional;
