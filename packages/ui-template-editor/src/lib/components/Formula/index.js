/* React */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Plugins */
import { FORMULA } from '../../TemplateEditor/plugins/withClauseSchema';

//  overflow-wrap: break-word; // NEEDS TO BE NONE
export const FormulaTooltip = styled.span`
  z-index: 2;
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
  transform: translateY(-110%);
  white-space: normal;

  &:before {
    content: '';
    position: absolute;
    bottom: -6.7px;
    left: 1px;
    border-top: 6px solid #141F3C;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -6.7px;
    left: 2px;
    border-top: 4px solid #141F3C;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
`;

/**
 * Component to render an inline formula node
 * This will have an id property of the Slate key
 * @param {*} props
 */
const Formula = React.forwardRef((props, ref) => {
  const {
    attributes,
    children,
    children: { props: { node } },
    children: { props: { node: { data } } },
    setFormulaNode,
    setHoveringFormulaContract
  } = props;
  const [hoveringFormula, setHoveringFormula] = useState(false);

  const handlerIn = () => {
    setHoveringFormula(true);
    setHoveringFormulaContract(true);
    setFormulaNode(node);
  };

  const handlerOut = () => {
    setHoveringFormula(false);
    setHoveringFormulaContract(false);
    setFormulaNode({});
  };

  const wrapperProps = {
    onMouseEnter: () => handlerIn(),
    onMouseLeave: () => handlerOut(),
    ...attributes,
  };

  const formulaProps = {
    id: data.name,
    className: FORMULA,
    ref,
    ...attributes
  };

  const formulaTooltip = {
    className: 'variableTooltip',
    currentHover: hoveringFormula,
    contentEditable: false
  };

  return (
    <span {...wrapperProps}>
      <FormulaTooltip {...formulaTooltip}>
          {data.code}
      </FormulaTooltip>
      <span {...formulaProps}>{children}</span>
    </span>
  );
});

Formula.displayName = 'Formula';

Formula.propTypes = {
  attributes: PropTypes.PropTypes.shape({
    'data-key': PropTypes.string,
  }),
  children: PropTypes.object.isRequired,
  setHoveringFormulaContract: PropTypes.func,
  setFormulaNode: PropTypes.func,
  editor: PropTypes.any,
  node: PropTypes.shape({
    data: PropTypes.obj,
  }),
  readOnly: PropTypes.bool,
};

export default Formula;
