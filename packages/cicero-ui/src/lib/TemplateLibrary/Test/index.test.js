import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TemplateCard from '../Components/TemplateCard';
import TemplateLibrary from '../index';

const templateArray = [
  {
    description: 'This clause allows the receiver of goods to inspect them for a given time period after delivery.',
    name: 'acceptance-of-delivery',
    uri: 'ap://acceptance-of-delivery@0.11.0#311de48109cce10e6b2e33ef183ccce121886d0b76754d649d5054d1084f93cd',
    version: '0.11.0'
  },
  {
    description: 'a Simple Car Rental Contract in Turkish Language',
    name: 'car-rental-tr',
    uri: 'ap://car-rental-tr@0.8.0#1d6de2328745fe4bae726e0fb887fee6d3fbd00b3d717e30e38dc7bffd7222fa',
    version: '0.8.0'
  },
  {
    description: 'This clause is a copyright license agreement.',
    name: 'copyright-license',
    uri: 'ap://copyright-license@0.12.0#55d73ab5dacc642d8a7cd0bc95c7da5580bd031e00b955616837abd50be08b6b',
    version: '0.12.0'
  },
  {
    description: 'A sample demandforecast clause.',
    name: 'demandforecast',
    uri: 'ap://demandforecast@0.11.0#ac252106feb1f685f5ecceb12b967bb8210ca5283660b5bf72aeb5b397342f87',
    version: '0.11.0'
  },
  {
    description: 'Counts events from DocuSign connect with a given envelope status.',
    name: 'docusign-connect',
    uri: 'ap://docusign-connect@0.5.0#4b44811f4f3e4899c026c35f4180d6c555f9101e8fcca35a13ad09aa2e28b7f7',
    version: '0.5.0'
  },
  {
    description: 'This is a clause enforcing healthy eating habits in employees.',
    name: 'eat-apples',
    uri: 'ap://eat-apples@0.8.0#5d04f0bb8698e1e7565e496aa97beb055b1f3e7fb353d0b0447aeaac59729ed2',
    version: '0.8.0'
  },
];

const mockUpload = jest.fn();
const mockImport = jest.fn();
const addNewTemplate = jest.fn();
const mockAddToCont = jest.fn();

const propInput = {
  templates: templateArray,
  upload: mockUpload,
  import: mockImport,
  addTemp: addNewTemplate,
  addToCont: mockAddToCont,
};

const libraryProps = {
  ACTION_BUTTON: 'red',
  ACTION_BUTTON_BG: 'red',
  ACTION_BUTTON_BORDER: 'red',
  HEADER_TITLE: 'red',
  TEMPLATE_BACKGROUND: 'red',
  TEMPLATE_DESCRIPTION: 'red',
  TEMPLATE_TITLE: 'red',
};

describe('<TemplateLibrary />', () => {
  describe('on initialization', () => {
    it('renders page correctly', () => {
      const component = shallow(<TemplateLibrary {...propInput} libraryProps={libraryProps} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('renders conditional buttons', () => {
    it('with functions passed in', () => {
      const component = shallow(<TemplateLibrary libraryProps={libraryProps} {...propInput} />);
      expect(component.find('UploadComponent')).toHaveLength(1);
      expect(component.find('ImportComponent')).toHaveLength(1);
      expect(component.find('NewClauseComponent')).toHaveLength(1);
    });

    it('without functions passed in', () => {
      const component = shallow(<TemplateLibrary libraryProps={libraryProps} />);
      expect(component.find('UploadComponent')).toHaveLength(0);
      expect(component.find('ImportComponent')).toHaveLength(0);
      expect(component.find('NewClauseComponent')).toHaveLength(0);
    });
  });

  describe('runs functions passed into it', () => {
    it('add To Contract function runs', () => {
      const component = shallow(
        <TemplateCard
          key={templateArray[0].uri}
          template={templateArray[0]}
          addToCont={mockAddToCont}
          libraryProps={libraryProps}
        />
      );
      expect(component.find('.templateAction').prop('addToCont')).toEqual(mockAddToCont);
    });
  });
});
