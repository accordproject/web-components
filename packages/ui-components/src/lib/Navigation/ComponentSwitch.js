/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Styling */
import * as SC from './styles';

/* Constants */
import { NAVIGATION, FILES } from './constants';

/**
 * Represents the navigation between both navigation
 * components, and provides the means to switch between
 * the two components with a state from props
 * @param {*} props
 */
const NavigationComponent = (props) => {
  const navigationProps = {
    className: props.navState === 'NAVIGATION'
      ? 'ui-components__navigation-switch-title-active'
      : 'ui-components__navigation-switch-title-inactive',
    navState: props.navState,
    onClick: () => props.setNavState(NAVIGATION),
  };

  const fileProps = {
    className: props.navState === 'FILES'
      ? 'ui-components__navigation-switch-title-active'
      : 'ui-components__navigation-switch-title-inactive',
    navState: props.navState,
    onClick: () => props.setNavState(FILES),
  };

  return (
    <React.Fragment>
        <SC.Navigation {...navigationProps}>
            NAVIGATION
        </SC.Navigation>
        <SC.Files {...fileProps}>
            FILES
        </SC.Files>
    </React.Fragment>
  );
};

NavigationComponent.propTypes = {
  setNavState: PropTypes.func.isRequired,
  navState: PropTypes.string.isRequired,
};

export default NavigationComponent;
