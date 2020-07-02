import React from 'react';
import PropTypes from 'prop-types';

/* eslint no-param-reassign: 0 */
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
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
