import React from 'react';
import PropTypes from 'prop-types';
import { HTML_BLOCK } from '../../utilities/schema';

const Html = ({
  attributes,
  children
}) => (<pre className={HTML_BLOCK} {...attributes}>{children}</pre>);

Html.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default Html;
