/* React */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Plugins */
import { VARIABLE } from '../../TemplateEditor/plugins/withClauseSchema';
import { getDecoratorArguments } from '../../utilities/variableDecorators';

/**
 * Copies values if present in a source object into a destination
 * object, optionally renaming keys
 * @param {object} source the source object, used to read value
 * @param {string} sourceKey the name of the key in the source object
 * @param {object} destination the destination object to be modified
 * @param {[string]} destinationKey the name of the key to set in the
 * destination object, if null the sourceKey is used.
 */
const override = (source, sourceKey, destination, destinationKey) => {
  if (source[sourceKey] !== undefined) {
    destination[destinationKey || sourceKey] = source[sourceKey];
  }
};

const VariableWrapper = styled.span`
  border: ${props => props.border} 1px solid !important;
  background-color: ${props => props['background-color']} !important;
  opacity: ${props => props.opacity} !important;
  ${props => props['font-family'] ? `font-family:${props['font-family']}!important;` : ''}
  `;

const Variable = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    editor,
    element,
    isFormulaDependency
  } = props;

  const variableStyles = getDecoratorArguments(element);
  const style = {};
  const defaultColor = '#A4BBE7';
  style.border = defaultColor;
  style['background-color'] = '#FFFFFF';
  style.border = defaultColor;
  style.opacity = 1;

  if (isFormulaDependency(editor, element)) {
    style.border = '#AF54C4';
    style['background-color'] = '#BED3FC';
    style.border = defaultColor;
  }

  // allow decorator on the variable to override styles
  if (variableStyles) {
    override(variableStyles, 'border', style);
    override(variableStyles, 'backgroundColor', style, 'background-color');
    override(variableStyles, 'opacity', style);
    override(variableStyles, 'fontFamily', style, 'font-family');
  }

  const VARIABLE_PROPS = {
    className: VARIABLE,
    name: element.data.name,
    ...attributes,
    ...style,
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
