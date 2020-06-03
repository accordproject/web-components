/* React */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import { NavigationWrapper } from './styles';

/* Constants */
import { NAVIGATION, FILES } from './constants';

/* Components */
import ContractNavigation from './Contract';
import FilesNavigation from './Files';
import ComponentSwitch from './ComponentSwitch';

/**
 * Represents the overall navigation wrapper, consisting of
 * two separate components, navigating between headers of the
 * contract or files of a single clause
 * @param {*} props
 */
const NavigationComponent = (props) => {
  const [navState, setNavState] = useState(NAVIGATION);
  const navigationState = () => navState === NAVIGATION;
  const filesState = () => navState === FILES;

  const switchProps = {
    navState,
    setNavState,
  };

  const navigationGenerator = (props) => {
    if (navigationState()) {
      return <ContractNavigation className="cicero-ui__navigation-contract" {...props} />;
    }
    if (filesState()) {
      return <FilesNavigation className="cicero-ui__navigation-file" {...props} />;
    }
    return 'Select Navigation or Files';
  };

  return (
    <NavigationWrapper className="cicero-ui__navigation-wrapper" >
        <ComponentSwitch {...switchProps} />
        {navigationGenerator(props)}
    </NavigationWrapper>
  );
};

NavigationComponent.propTypes = {
  headers: PropTypes.array.isRequired,
  navigateHeader: PropTypes.func,
};

export default NavigationComponent;
