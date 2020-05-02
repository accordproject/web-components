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
  const navigationProps = props.navigationProps || Object.create(null);

  const [navState, setNavState] = useState(NAVIGATION);
  const navigationState = () => navState === NAVIGATION;
  const filesState = () => navState === FILES;

  const navigationWrapperProps = {
    id: 'NavigationWrapperComponent',
    positionValue: navigationProps.NAVIGATION_POSITION,
    topValue: navigationProps.NAVIGATION_TOP_VALUE,
    navMaxHeight: navigationProps.NAVIGATION_MAX_HEIGHT,
    navWidth: navigationProps.NAVIGATION_WIDTH,
    backgroundColor: navigationProps.NAVIGATION_BACKGROUND_COLOR,
  };

  const switchProps = {
    navState,
    setNavState,
    filesVisible: navigationProps.NAVIGATE_SWITCH_FILES_VISIBLE,
    headerFont: navigationProps.NAVIGATE_SWITCH_TITLE_FONT_FAMILY,
    titleActive: navigationProps.NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR,
    titleInactive: navigationProps.NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR,
  };

  const contractProps = {
    headerColor: navigationProps.CONTRACT_NAVIGATION_HEADER_COLOR,
    clauseColor: navigationProps.CONTRACT_NAVIGATION_CLAUSE_COLOR,
    clauseHeaderColor: navigationProps.CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR,
  };

  const filesProps = {
    titleColor: navigationProps.CLAUSE_NAVIGATION_TITLE_COLOR,
    titleHover: navigationProps.CLAUSE_NAVIGATION_TITLE_HOVER_COLOR,
    arrowColor: navigationProps.CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR,
    arrowHover: navigationProps.CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR,
    deleteColor: navigationProps.CLAUSE_NAVIGATION_FILE_DELETE_COLOR,
    deleteHover: navigationProps.CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR,
    addColor: navigationProps.CLAUSE_NAVIGATION_FILE_ADD_COLOR,
    addHover: navigationProps.CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR,
  };

  const navigationGenerator = (props) => {
    if (navigationState()) {
      return <ContractNavigation
        id="ContractNavigationComponent" {...props} styleProps={contractProps} />;
    }
    if (filesState()) {
      return <FilesNavigation
        id="FilesNavigationComponent" {...props} styleProps={filesProps} />;
    }
    return 'Select Navigation or Files';
  };

  return (
    <NavigationWrapper {...navigationWrapperProps} >
        <ComponentSwitch {...switchProps} />
        {navigationGenerator(props)}
    </NavigationWrapper>
  );
};

NavigationComponent.propTypes = {
  headers: PropTypes.array,
  navigateHeader: PropTypes.func,
  navigationProps: PropTypes.shape({
    NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR: PropTypes.string,
    NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR: PropTypes.string,
    NAVIGATE_SWITCH_TITLE_FONT_FAMILY: PropTypes.string,
    NAVIGATE_SWITCH_FILES_VISIBLE: PropTypes.bool.isRequired,

    NAVIGATION_POSITION: PropTypes.string,
    NAVIGATION_TOP_VALUE: PropTypes.string,
    NAVIGATION_MAX_HEIGHT: PropTypes.string,
    NAVIGATION_WIDTH: PropTypes.string,
    NAVIGATION_BACKGROUND_COLOR: PropTypes.string,

    CONTRACT_NAVIGATION_HEADER_COLOR: PropTypes.string,
    CONTRACT_NAVIGATION_CLAUSE_COLOR: PropTypes.string,
    CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR: PropTypes.string,

    CLAUSE_NAVIGATION_TITLE_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_TITLE_HOVER_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_FILE_DELETE_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_FILE_ADD_COLOR: PropTypes.string,
    CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR: PropTypes.string,
  }),
};

export default NavigationComponent;
