/* React */
import React, { useState } from 'react';
import { Editor, Transforms } from 'slate';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';

/* Plugins */
import { CONDITIONAL } from '../../ContractEditor/plugins/withClauseSchema';

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
  const isNotEmptyString = node.children[0].text !== '';
  const isEmptyString = node.children[0].text === '';
  const conditional = {
    id: data.id,
    whenTrue: data.whenTrue,
    whenFalse: data.whenFalse,
    isFalse: (
      node.children[0].text === data.whenFalse
    ),
  };

  const toggleConditional = (path) => {
    const newConditional = {
      object: 'inline',
      type: CONDITIONAL,
      data: {
        id: conditional.id,
        whenTrue: conditional.whenTrue,
        whenFalse: conditional.whenFalse
      },
      children: [{
        object: 'text',
        text: conditional.isFalse
          ? conditional.whenTrue
          : conditional.whenFalse
      }]
    };
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(editor, newConditional, { at: path });
    });
  };

  const conditionalProps = {
    id: conditional.id,
    className: node.children[0].text === '' ? '' : CONDITIONAL,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    onClick: () => toggleConditional(conditionalPath),
    ...attributes,
    ref
  };

  const conditionalSwitchProps = {
    currentHover: hovering,
    ...conditional,
  };
  const conditionalIconProps = {
    currentHover: hovering,
    whenTrue: conditional.whenTrue,
    toggleConditional: () => toggleConditional(conditionalPath),
  };

  return (
    <>
        { isNotReadOnly && isNotEmptyString && <ConditionalSwitch {...conditionalSwitchProps} /> }
        { isNotReadOnly && isEmptyString && <ConditionalBoolean {...conditionalIconProps} /> }
        <span {...conditionalProps}>{children}</span>
    </>
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
    key: PropTypes.string,
    data: PropTypes.obj,
    text: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
};

export default Conditional;
