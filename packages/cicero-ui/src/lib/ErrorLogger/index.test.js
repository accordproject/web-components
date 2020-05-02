import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ErrorLogger from './index';

const parseError1 = {
  'b28f32b2-57d9-41e1-b871-03c9faa75b6e': {
    clauseId: 'b28f32b2-57d9-41e1-b871-03c9faa75b6e',
    parseError: {
      fileLocation: {
        end: {
          endColumn: 2,
          line: 1
        },
        start: {
          column: 1
        }
      },
      component: 'cicero-core',
      fileName: undefined,
      name: 'ParseException',
      shortMessage:
        '"invalid syntax at line 1 col 1:↵↵  a  Acceptance of Delivery. "Party A" will be deemed to have completed its delivery obligations if in "Party B"\'s opinion, the "Widgets" satisfies the Acceptance Criteria, and "Party B" notifies "Party A" in writing that it is accepting the "Widgets".↵  ^↵Unexpected "a"↵"',
      message:
        '"invalid syntax at line 1 col 1:↵↵  a  Acceptance of Delivery. "Party A" will be deemed to have completed its delivery obligations if in "Party B"\'s opinion, the "Widgets" satisfies the Acceptance Criteria, and "Party B" notifies "Party A" in writing that it is accepting the "Widgets".↵  ^↵Unexpected "a"↵"'
    }
  }
};

describe('<ErrorLogger />', () => {
  describe('on initialization', () => {
    it('renders page correctly with errors', () => {
      const component = shallow(<ErrorLogger errors={parseError1} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

    it('renders page correctly without errors', () => {
      const component = shallow(<ErrorLogger errors={{}} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renders conditional to errors', () => {
    it('with errors existing', () => {
      const component = shallow(<ErrorLogger errors={parseError1} />);
      expect(component.find('#ErrorComponentHeader').exists()).toBeTruthy();

      component.find('#ErrorComponentHeader').simulate('click');

      expect(component.find('#ErrorComponentDisplay').exists()).toBeTruthy();
    });

    it('without errors existing', () => {
      const component = shallow(<ErrorLogger errors={{}} />);
      expect(component.find('#ErrorComponentHeader').exists()).toBeTruthy();
      expect(component.find('#ErrorComponentDisplay').exists()).toBe(false);

      component.find('#ErrorComponentHeader').simulate('click');

      expect(component.find('#ErrorComponentDisplay').exists()).toBe(false);
    });
  });
});
