import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ErrorComponent from './Error';

const emptyFunction = jest.fn(() => {});

const mockedError = {
  clauseId: 'mockedId',
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
    component: 'mockedComponent',
    fileName: 'mockedFileName',
    name: 'mockedName',
    shortMessage:
      'mockedShortMessage',
    message:
      'mockedLoginMessage'
  }
};

const mockedProps = { error: mockedError, errorNav: emptyFunction, errorProps: {} };

describe('<ErrorComponent />', () => {
  it('should render correct component', () => {
    const component = shallow(<ErrorComponent {...mockedProps} />);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should show full message after clicking on arrow', () => {
    const component = shallow(<ErrorComponent {...mockedProps} />);
    component.find('ArrowDiv').simulate('click');
    expect(component.find('ErrorFullMessage').exists()).toBeTruthy();
  });
  it('should show full message after clicking on error type', () => {
    const component = shallow(<ErrorComponent {...mockedProps} />);
    component.find('ErrorType').simulate('click');
    expect(component.find('ErrorFullMessage').exists()).toBeTruthy();
  });
  it('should show full message after clicking on short message', () => {
    const component = shallow(<ErrorComponent {...mockedProps} />);
    component.find('ErrorShortMessage').simulate('click');
    expect(component.find('ErrorFullMessage').exists()).toBeTruthy();
  });
  it('should call errorNav function on click', () => {
    const component = shallow(<ErrorComponent {...mockedProps} />);
    component.find('ErrorFile').simulate('click');
    expect(emptyFunction).toHaveBeenCalledTimes(1);
  });
});
