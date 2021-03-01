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
import { ModelManager } from '@accordproject/concerto-core';
import { render, waitFor, screen } from '@testing-library/react';
import Generator from './formgenerator';

const fs = require('fs');

describe('formgenerator Tests', () => {
  const modelManager = new ModelManager();
  modelManager.addModelFile(
    `namespace org.accordproject.base
  abstract asset Asset {  }
  abstract participant Participant {  }
  abstract transaction Transaction identified by transactionId {
    o String transactionId
  }
  abstract event Event identified by eventId {
    o String eventId
  }`,
    'org.accordproject.base.cto',
    false,
  );
  modelManager.updateExternalModels();
  describe('#validation', () => {
    it('accepts a model string as input', async () => {
      const generator = new Generator(modelManager);
      expect(generator).not.toBeNull();
    });
  });
  describe('#instantiate', () => {
    it('generates a form from text', async () => {
      const text = fs.readFileSync(`${__dirname}/../test/data/relationship.cto`, 'utf8');
      const options = {
        customClasses: {
          field: 'form-group',
          input: 'form-control',
          label: 'control-label'
        },
        updateExternalModels: true,
      };
      modelManager.addModelFile(text, 'model', true);
      modelManager.updateExternalModels();
      const generator = new Generator(modelManager, options);
      expect(generator).not.toBeNull();
      expect(generator.getTypes()).toHaveLength(2);

      const generatedInstance = generator.generateJSON('test.Person');
      const json = {
        ...generatedInstance,
        address: {
          ...generatedInstance.address,
          $identifier: 'a9c0177b-f08f-417e-a956-7a7c9e9701e5',
        }
      };
      const form = generator.generateHTML('test.Person', json);

      const { container } = render(<div>{ form }</div>);
      await waitFor(() => screen.getByText('Name'));
      expect(container).toMatchSnapshot();
    });
  });
});
