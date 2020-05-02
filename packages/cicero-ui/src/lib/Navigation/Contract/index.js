/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Generators */
import * as GEN from '../generators';

/* Styling */
import * as SC from '../styles';

/**
 * Represents all headers currently in a contract
 * @param {*} props
 */
const ContractNavigation = props => (
      <SC.ContractHeaders>
          {GEN.headerGenerator(props)}
      </SC.ContractHeaders>
);

ContractNavigation.propTypes = {
  headers: PropTypes.array,
  navigateHeader: PropTypes.func,
  styleProps: PropTypes.shape({
    headerColor: PropTypes.string,
    clauseColor: PropTypes.string,
    clauseHeaderColor: PropTypes.string,
  }),
};

export default ContractNavigation;
