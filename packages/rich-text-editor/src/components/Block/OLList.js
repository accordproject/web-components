import React from 'react';
import PropTypes from 'prop-types';

const OLList = ({
  attributes,
  children
}) => (<ol {...attributes}>{children}</ol>);

OLList.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default OLList;
