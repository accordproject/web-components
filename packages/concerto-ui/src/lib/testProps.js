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
export const options = {
  includeOptionalFields: true,
  includeSampleData: 'sample',
};

export const model = `namespace org.hyperledger.concerto.form.test
  
  concept Foo {
    o String s
    o Boolean b optional
    o DateTime dt
    o Integer i
    o Double d
    o Bar bar
    o String[] ss
    o Boolean[] bs
    o DateTime[] dts
    o Bar[] bars
    o Nums n
    --> MyAsset ref
  }
  
  enum Nums {
    o ONE
    o TWO
  }
  
  abstract concept Bar {
    o String s
  }
  
  concept Baz extends Bar{
    o String t
  }
  
  asset MyAsset identified by id {
    o String id
  }
  `;

export const type = 'org.hyperledger.concerto.form.test.Foo';

export const json = {
  $class: 'org.hyperledger.concerto.form.test.Foo',
  s: 'Ullamco eiusmod laborum.',
  b: true,
  dt: '2019-04-03T10:26:11.168+01:00',
  i: 27587,
  d: 70.808,
  bar: {
    $class: 'org.hyperledger.concerto.form.test.Baz',
    t: 'Enim.',
    s: 'Magna amet sit.',
  },
  ss: ['Consectetur enim laborum Lorem fugiat.'],
  bs: [false],
  dts: ['2019-04-03T10:26:11.168+01:00'],
  bars: [
    {
      $class: 'org.hyperledger.concerto.form.test.Baz',
      t: 'Laborum.',
      s: 'Ut mollit.',
    },
  ],
  n: 'ONE',
  ref: 'resource:org.hyperledger.concerto.form.test.MyAsset#2256',
};
export const readOnly = true;
export const props = {
  models: [model],
  type,
  json,
  options,
  readOnly,
};
