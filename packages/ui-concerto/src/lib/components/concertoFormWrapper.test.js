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
import renderer from 'react-test-renderer';

import ConcertoFormWrapper from './concertoFormWrapper';
import { props, type, model, options } from './testProps';

test('Render form, default', async () => {
  const onValueChange = jest.fn();

  const testRenderer = renderer.create(
    <ConcertoFormWrapper
      onValueChange={onValueChange}
      {...props}
    />
  );

  expect(testRenderer.toJSON()).toMatchSnapshot();
});

test.skip('Render form, no JSON provided', async () => {
  const onValueChange = jest.fn();

  const testRenderer = renderer.create(
    <ConcertoFormWrapper
      onValueChange={onValueChange}
      type={type}
      models={[model]}
      options={options}
    />
  );

  expect(testRenderer.toJSON()).toMatchSnapshot();
});
