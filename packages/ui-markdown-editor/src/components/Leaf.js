import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Code = styled.code`
  color: black;
  border: 1px solid #D3D3D3;
  background: #ededeb;
  border-radius: 2.5px;
  padding: 0px 2px;
`;

/* eslint no-param-reassign: 0 */
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <Code>{children}</Code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  return <span {...attributes}>{children}</span>;
};

Leaf.propTypes = {
  children: PropTypes.node,
  leaf: PropTypes.object,
  attributes: PropTypes.any
};

export default Leaf;
