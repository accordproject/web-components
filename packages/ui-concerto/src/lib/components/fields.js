/* eslint-disable react/prop-types */
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
import { Relationship } from '@accordproject/concerto-core';
import { Checkbox, Input, Form, Button, Select, Popup, Label, Icon } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { parseValue, normalizeLabel } from '../utilities';

export const ConcertoLabel = ({ skip, name }) => !skip
  ? <label>{normalizeLabel(name)}</label> : null;

export const ConcertoCheckbox = ({
  id,
  field,
  readOnly,
  required,
  value,
  onFieldValueChange,
  skipLabel,
}) => (
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <Checkbox
      toggle
      readOnly={readOnly}
      checked={value}
      onChange={(e, data) => onFieldValueChange(data, id)}
      key={id}
    />
  </Form.Field>
);

export const ConcertoInput = ({
  id,
  field,
  readOnly,
  required,
  value,
  onFieldValueChange,
  skipLabel,
  type,
}) => (
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <Input
      type={type}
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange(
        { ...data, value: parseValue(data.value, field.getType()) },
        id
      )
      }
      key={id}
    />
  </Form.Field>
);

export const ConcertoRelationship = ({
  id,
  field,
  readOnly,
  required,
  value = '',
  onFieldValueChange,
  skipLabel,
  type,
}) => {
  if (!value) {
    return null;
  }

  const relationship = Relationship.fromURI(field.getModelFile().getModelManager(), value);

  return <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <Input
      type={type}
      label={<Label basic>{normalizeLabel(relationship.getType())}</Label>}
      icon='long arrow alternate right'
      iconPosition='left'
      labelPosition='right'
      readOnly={readOnly}
      value={relationship.getIdentifier()}
      onChange={(e, data) => {
        relationship.setIdentifier(parseValue(data.value || 'resource1', field.getType()));
        return onFieldValueChange(
          { ...data, value: relationship.toURI() },
          id
        );
      }
      }
      key={id}
    />
    <span className='monospaced'>{value}</span>
  </Form.Field>;
};

export const ConcertoDateTime = ({
  id,
  field,
  readOnly,
  required,
  value,
  onFieldValueChange,
  skipLabel,
}) => (
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <DateTimeInput
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange(data, id)}
      dateTimeFormat={'YYYY-MM-DDTHH:mm:ss.sssZ'}
      key={id}
      animation='none'
    />
  </Form.Field>
);

export const ConcertoArray = ({
  id,
  field,
  readOnly,
  required,
  children,
  addElement,
}) => (
  <Form.Field required={required}>
    <ConcertoLabel name={field.getName()} />
    {children}
    <div className="arrayElement grid">
      <div />
      <div>
        <Button
          basic
          circular
          aria-label={`Add an element to ${normalizeLabel(`${id}`)}`}
          icon={<Popup
            content='Add an element'
            position='left center'
            trigger={<Icon name='plus circle'/>}
          />}
          disabled={readOnly}
          className='arrayButton'
          onClick={e => {
            addElement(e, id);
            e.preventDefault();
          }}
        />
      </div>
    </div>
  </Form.Field>
);

export const ConcertoArrayElement = ({
  id,
  readOnly,
  children,
  index,
  removeElement,
}) => (
  <div className="arrayElement grid">
    <div>{children}</div>
    <div>
      <Button
        basic
        circular
        icon={<Popup
          content='Remove this element'
          position='left center'
          trigger={<Icon name='minus circle'/>}
        />}
        aria-label={`Remove element ${index} from ${normalizeLabel(`${id}`)}`}
        className='arrayButton'
        disabled={readOnly}
        onClick={e => {
          removeElement(e, id, index);
          e.preventDefault();
        }}
      />
    </div>
  </div>
);

export const ConcertoDropdown = ({
  id,
  field,
  readOnly,
  value,
  onFieldValueChange,
  options,
}) => (
  <Form.Field required key={field.getName().toLowerCase()}>
    {!readOnly ? (
      <Select
        fluid
        value={value}
        onChange={(e, data) => onFieldValueChange(data, id)}
        key={id}
        options={options}
      />
    ) : (
      <Input type="text" readOnly value={value} key={id} />
    )}
  </Form.Field>
);

const BinaryField = ({ className, children }) => (
  <div className={className}>
    <div>{children[0]}</div>
    <div>{children[1]}</div>
  </div>
);

export const MonetaryAmount = ({ children }) => (
  <BinaryField className="monetaryAmount">{children}</BinaryField>
);

export const Duration = ({ children }) => (
  <BinaryField className="duration">{children}</BinaryField>
);
