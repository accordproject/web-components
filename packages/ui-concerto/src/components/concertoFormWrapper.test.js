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
import { render, waitFor, screen } from '@testing-library/react';
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
  ],
};
/**
 * Get the name and contents of all model test files
 * @returns {*} an array of name/contents tuples
 */
function getModelFiles() {
  const result = [];
  const files = fs.readdirSync(`${__dirname}/../../../test/data`);
  files.forEach((file) => {
    if (file.endsWith('.cto')) {
      const contents = fs.readFileSync(`${__dirname}/../../../test/data/${file}`, 'utf8');
      const json = fs.readFileSync(`${__dirname}/../../../test/data/${file.replace('cto', 'json')}`, 'utf8');
      result.push([file, contents, json]);
    }
  });
  return result;
}
describe('render form', () => {
  getModelFiles().forEach(([file, modelText, json]) => {
    it(`creates a React form for model ${file}`, async () => {
      const { container } = render(
        <ConcertoForm
          readOnly={readOnly}
          models={[modelText]}
          options = {options}
          type={type}
          json={JSON.parse(json)}
          onValueChange={(json) => json}
      />
      );
      await waitFor(() => screen.getByText('Name'));
      expect(container).toMatchSnapshot();
    });
  });
});
