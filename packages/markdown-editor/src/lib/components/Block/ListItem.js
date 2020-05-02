import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({
  attributes,
  children
}) => (<li {...attributes}>{children}</li>);

ListItem.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default ListItem;
