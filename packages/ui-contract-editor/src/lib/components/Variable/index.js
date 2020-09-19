/* React */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Plugins */
import { VARIABLE } from '../../ContractEditor/plugins/withClauseSchema';
import { isReadOnlyVariable, getOpacity } from '../../utilities/readOnlyVariable';

const VariableWrapper = styled.span`
  border: ${props => props.formulaDependency ? '#AF54C4' : '#A4BBE7'} 1px solid !important;
  background-color: ${props => props.formulaDependency ? '#BED3FC' : '#FFFFFF'} !important;
  opacity: ${props => props.opacity} !important;
`;

const Variable = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    editor,
    element,
    isFormulaDependency
  } = props;

  const VARIABLE_PROPS = {
    className: VARIABLE,
    name: element.data.name,
    opacity: getOpacity(element),
    formulaDependency: isFormulaDependency(editor, element),
    ...attributes,
    ref
  };

  return (<VariableWrapper {...VARIABLE_PROPS}>{children}</VariableWrapper>);
});

Variable.displayName = 'Variable';

Variable.propTypes = {
  attributes: PropTypes.PropTypes.shape({
    'data-key': PropTypes.string,
  }),
  children: PropTypes.object.isRequired,
  editor: PropTypes.any,
  element: PropTypes.any,
  isFormulaDependency: PropTypes.func
};

export default Variable;
