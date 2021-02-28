/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import path from 'path';
import fs from 'fs';

import Generator from './formgenerator';

Enzyme.configure({ adapter: new Adapter() });

describe('formgenerator Tests', () => {
  describe('#validation', () => {
    it('accepts a model string as input', async () => {
      const generator = new Generator();
      expect(generator).not.toBeNull();
    });
  });

  describe('#generateJSON', () => {
    it('generates default JSON for a model', async () => {
      const text = fs.readFileSync(path.resolve(__dirname, './__tests__/order.cto'), 'utf-8');
      const generator = new Generator({});
      expect(generator).not.toBeNull();

      await generator.loadFromText([text]);
      expect(generator.getTypes()).toHaveLength(3);

      const json = generator.generateJSON('org.accordproject.Order');
      expect(json).toMatchSnapshot({
        $identifier: expect.stringMatching(''),
        product: expect.stringMatching('resource:org.accordproject.Product#'),
      });
    });
  });

  describe('#generateHTML', () => {
    it('generates a form from text with external model', async () => {
      const text = fs.readFileSync(path.resolve(__dirname, './__tests__/bond.cto'), 'utf-8');
      const options = {
        customClasses: {
          field: 'form-group',
          input: 'form-control',
          label: 'control-label'
        },
        updateExternalModels: true,
      };
      const generator = new Generator(options);
      expect(generator).not.toBeNull();

      await generator.loadFromText([text]);
      expect(generator.getTypes()).toHaveLength(13);

      const json = fs.readFileSync(path.resolve(__dirname, './__tests__/bond.json'), 'utf-8');
      const form = generator.generateHTML('org.accordproject.finance.bond.BondAsset', json);
      const component = mount(<div>{ form }</div>);
      expect(component.html()).toMatchSnapshot();
    });

    it('generates a form from text with relationship', async () => {
      const text = fs.readFileSync(path.resolve(__dirname, './__tests__/order.cto'), 'utf-8');
      const generator = new Generator({});
      expect(generator).not.toBeNull();

      await generator.loadFromText([text]);
      expect(generator.getTypes()).toHaveLength(3);

      const json = fs.readFileSync(path.resolve(__dirname, './__tests__/order.json'), 'utf-8');
      const form = generator.generateHTML('org.accordproject.Order', json);
      const component = mount(<div>{ form }</div>);
      expect(component.html()).toMatchSnapshot();
    });
  });
});
