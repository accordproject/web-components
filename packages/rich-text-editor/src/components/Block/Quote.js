import React from 'react';
import PropTypes from 'prop-types';

const Quote = ({
  attributes,
  children
}) => (<blockquote {...attributes}>{children}</blockquote>);

Quote.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default Quote;
