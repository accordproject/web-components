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
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConcertoForm from './concertoForm';

const fs = require('fs');

const readOnly = false;
const type = 'test.Person';
const options = {
  includeOptionalFields: true,
  includeSampleData: 'sample',
  updateExternalModels: true,
  hiddenFields: [
    'org.accordproject.base.Transaction.transactionId',
    'org.accordproject.cicero.contract.AccordContract.contractId',
    'org.accordproject.cicero.contract.AccordClause.clauseId',
    'org.accordproject.cicero.contract.AccordContractState.stateId',
    'test.Person.hiddenInConfig',
  ],
};
/**
 * Get the name and contents of all model test files
 * @returns {*} an array of name/contents tuples
 */
function getModelFiles() {
  const result = [];
  const files = fs.readdirSync(`${__dirname}/../../test/data`);
  files.forEach((file) => {
    if (file.endsWith('.cto')) {
      const contents = fs.readFileSync(`${__dirname}/../../test/data/${file}`, 'utf8');
      const json = fs.readFileSync(`${__dirname}/../../test/data/${file.replace('cto', 'json')}`, 'utf8');
      result.push([file, contents, json]);
    }
  });
  return result;
}
describe('render form', () => {
  getModelFiles().forEach(([file, modelText, json]) => {
    it(`creates a React form for model ${file}`, async () => {
      const onValueChange = jest.fn();
      const parsedJson = JSON.parse(json);
      const { container } = render(
        <ConcertoForm
          readOnly={readOnly}
          models={[modelText]}
          options = {options}
          type={type}
          json={parsedJson}
          onValueChange={onValueChange}
      />
      );
      await waitFor(() => screen.getByText('Name'));
      expect(container).toMatchSnapshot();

      // Exercise the onChange handlers
      const nameInput = screen.getByLabelText('Name');
      userEvent.type(nameInput, ' Roberts');
      expect(onValueChange).toHaveBeenLastCalledWith({
        ...parsedJson,
        name: `${parsedJson.name} Roberts`
      });

      // Exercise array buttons
      if (parsedJson.children) {
        const callCount = onValueChange.mock.calls.length;
        expect(onValueChange.mock.calls[callCount - 1][0].children).toHaveLength(1);

        const addButton = screen.getByRole('button', {
          name: /Add an element to Children/
        });
        fireEvent.click(addButton);
        expect(onValueChange.mock.calls[callCount][0].children).toHaveLength(2);

        const removeButton = screen.getByRole('button', {
          name: /Remove element 0 from Children/
        });
        fireEvent.click(removeButton);
        expect(onValueChange.mock.calls[callCount + 1][0].children).toHaveLength(1);
      }
    });
  });
});
