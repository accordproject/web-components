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
import { mount } from 'enzyme';
import waitUntil from 'async-wait-until';
import ConcertoFormWrapper from './concertoFormWrapper';
import { props, type, model, options } from './testProps';

test('Render form, default', async () => {
  let component;

  const onModelChange = jest.fn((modelProps) => {
    component.setProps(modelProps);
  });
  const onValueChange = jest.fn();

  component = mount(
    <ConcertoFormWrapper
      onModelChange={onModelChange}
      onValueChange={onValueChange}
      {...props}
    />,
  );

  await waitUntil(() => onModelChange.mock.calls.length > 0, 500);
  expect(onModelChange.mock.calls[0][0].types).toHaveLength(3);

  expect(component.html()).toMatchSnapshot();
});

test('Render form, no JSON provided', async () => {
  let component;

  const onModelChange = jest.fn((modelProps) => {
    component.setProps(modelProps);
  });
  const onValueChange = jest.fn();

  component = mount(
    <ConcertoFormWrapper
      onModelChange={onModelChange}
      onValueChange={onValueChange}
      type={type}
      models={[model]}
      options={options}
    />,
  );

  await waitUntil(() => onModelChange.mock.calls.length > 0, 500);
  expect(onModelChange.mock.calls[0][0].types).toHaveLength(3);

  expect(component.prop('json')).toBeDefined();
});
