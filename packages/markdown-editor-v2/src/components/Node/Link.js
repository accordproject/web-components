import React from 'react';
import PropTypes from 'prop-types';

const Link = ({
  attributes,
  href,
  children
}) => (<a {...attributes} href={href}>{children}</a>);

Link.propTypes = {
  attributes: PropTypes.any,
  href: PropTypes.string,
  children: PropTypes.any
};

export default Link;
