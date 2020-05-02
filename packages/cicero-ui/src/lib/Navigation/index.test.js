import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NavigationComponent from './index';
import ComponentSwitch from './ComponentSwitch';


describe('<NavigationComponent />', () => {
  const propsFilesTrue = {
    navigationProps: {
      NAVIGATE_SWITCH_FILES_VISIBLE: true
    },
    navigateHeader: jest.fn(),
    headers: []
  };

  const propsFilesFalse = {
    navigationProps: {
      NAVIGATE_SWITCH_FILES_VISIBLE: false
    },
    navigateHeader: jest.fn(),
    headers: []
  };

  describe('on initialization', () => {
    it('renders component correctly showing Files', () => {
      const component = shallow(<NavigationComponent {...propsFilesTrue} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

    it('renders component correctly hiding Files', () => {
      const component = shallow(<NavigationComponent {...propsFilesFalse} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

    it('renders without files initially', () => {
      const component = shallow(<NavigationComponent {...propsFilesFalse} />);
      expect(component.find('#NavigationWrapperComponent').exists()).toBeTruthy();
      expect(component.find('#ContractNavigationComponent').exists()).toBeTruthy();
      expect(component.find('#FilesNavigationComponent').exists()).toBe(false);
    });
  });
});

describe('<ComponentSwitch />', () => {
  const propsFilesTrue = {
    filesVisible: true,
    navState: 'FILES',
    setNavState: jest.fn(),
  };

  const propsFilesFalse = {
    filesVisible: false,
    navState: 'NAVIGATION',
    setNavState: jest.fn(),
  };

  describe('on initialization', () => {
    it('renders component correctly showing Files', () => {
      const component = shallow(<ComponentSwitch {...propsFilesTrue} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

    it('renders component correctly showing Navigation', () => {
      const component = shallow(<ComponentSwitch {...propsFilesFalse} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });
});
