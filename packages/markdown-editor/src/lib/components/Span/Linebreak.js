import React from 'react';
import PropTypes from 'prop-types';
import { LINEBREAK } from '../../utilities/schema';

const Linebreak = ({ attributes }) => (<br className={LINEBREAK} {...attributes}/>);

Linebreak.propTypes = { attributes: PropTypes.any };

export default Linebreak;
