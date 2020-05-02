import React from 'react';
import PropTypes from 'prop-types';

const Paragraph = ({
  attributes,
  children
}) => (<p {...attributes}>{children}</p>);

Paragraph.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default Paragraph;
