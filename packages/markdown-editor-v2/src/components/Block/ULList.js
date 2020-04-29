import React from 'react';
import PropTypes from 'prop-types';

const ULList = ({
  attributes,
  children
}) => (<ul {...attributes}>{children}</ul>);

ULList.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default ULList;
