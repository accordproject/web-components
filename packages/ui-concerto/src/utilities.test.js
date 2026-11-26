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

import { normalizeLabel, parseValue } from './utilities';

describe('Utilities', () => {
  describe('#normalizeLabel', () => {
    it('accepts camelCase', async () => {
      expect(normalizeLabel('camelCase')).toEqual('Camel Case');
    });
    it('accepts camelABCCase', async () => {
      expect(normalizeLabel('camelABCCase')).toEqual('Camel ABC Case');
    });
    it('accepts CamelCase', async () => {
      expect(normalizeLabel('CamelCase')).toEqual('Camel Case');
    });
  });

  describe('#parseValue', () => {
    it('does not accept partial integer input', () => {
      expect(parseValue('12abc', 'Integer')).toEqual('12abc');
      expect(parseValue('12.5', 'Integer')).toEqual('12.5');
    });

    it('does not accept partial double input', () => {
      expect(parseValue('12.5abc', 'Double')).toEqual('12.5abc');
    });

    it('strictly casts valid numeric input', () => {
      expect(parseValue('-42', 'Integer')).toEqual(-42);
      expect(parseValue('12.5', 'Double')).toEqual(12.5);
    });
  });
});
