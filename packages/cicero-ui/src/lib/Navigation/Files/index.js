/* React */
import React from 'react';
import PropTypes from 'prop-types';

const ClauseNavigation = () => <p style={{ color: '#fff' }}>Feature in progress</p>;

ClauseNavigation.propTypes = {
  styleProps: PropTypes.shape({
    titleColor: PropTypes.string,
    titleHover: PropTypes.string,
    arrowColor: PropTypes.string,
    arrowHover: PropTypes.string,
    deleteColor: PropTypes.string,
    deleteHover: PropTypes.string,
    addColor: PropTypes.string,
    addHover: PropTypes.string,
  }),
};

export default ClauseNavigation;
