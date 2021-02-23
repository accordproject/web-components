import React from 'react';
import PropTypes from 'prop-types';

const CurrentTextValue = props => (
  <React.Fragment>
  <p><b>{props.textLabel}</b>{props.textValue}</p>
  </React.Fragment>
);

CurrentTextValue.propTypes = {
  textValue: PropTypes.string,
  textLabel: PropTypes.string,
};

export default React.memo(CurrentTextValue);
