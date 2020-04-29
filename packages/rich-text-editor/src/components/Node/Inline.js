import React from 'react';
import PropTypes from 'prop-types';
import { HTML_INLINE } from '../../utilities/schema';

const Inline = ({
  attributes,
  content,
  children
}) => (
    <span className={HTML_INLINE} {...attributes}>
        {content}{children}
    </span>
);

Inline.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any,
  content: PropTypes.any,
};

export default Inline;
