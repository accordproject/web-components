import React from 'react';
import PropTypes from 'prop-types';
import { SOFTBREAK } from '../../utilities/schema';

const Softbreak = ({
  attributes,
  children
}) => (<span className={SOFTBREAK} {...attributes}> {children}</span>);

Softbreak.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any
};

export default Softbreak;
