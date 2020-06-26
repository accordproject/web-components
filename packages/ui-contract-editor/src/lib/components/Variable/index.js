/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Plugins */
import { VARIABLE } from '../../ContractEditor/plugins/withClauseSchema';

const Variable = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    editor,
    element,
    isFormulaDependency,
  } = props;

  const VARIABLE_PROPS = {
    className: VARIABLE,
    name: element.data.name,
    styleCustom: isFormulaDependency(editor, element),
    ...attributes,
    ref
  };
  /*
  styleCustom will rename. but will indicate if this element needs to be highlighted
  as the dependency of a formula which is currently hovered over
  */

  return (<span {...VARIABLE_PROPS}>{children}</span>);
});

Variable.displayName = 'Variable';

Variable.propTypes = {
  attributes: PropTypes.PropTypes.shape({
    'data-key': PropTypes.string,
  }),
  children: PropTypes.object.isRequired,
  editor: PropTypes.any,
  element: PropTypes.any,
  isFormulaDependency: PropTypes.func,
};

export default Variable;
