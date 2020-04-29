import React from 'react';
import PropTypes from 'prop-types';

const Code = ({
  attributes,
  children
}) => (<pre {...attributes}>{children}</pre>);

Code.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default Code;
