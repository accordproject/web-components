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
import { parseValue, normalizeLabel, applyDecoratorTitle } from '../utilities';

export const ConcertoLabel = ({ skip, name, htmlFor }) => !skip
  ? <label htmlFor={htmlFor}>{normalizeLabel(name)}</label> : null;

export const ConcertoCheckbox = ({
  id,
  field,
  readOnly,
  required,
  value,
  onFieldValueChange,
  skipLabel,
  toggle
}) => (
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={applyDecoratorTitle(field)} htmlFor={id} />
    <Checkbox
      toggle={toggle}
      fitted
      id={id}
      readOnly={readOnly}
      checked={value}
      onChange={(e, data) => onFieldValueChange(data, id)}
      key={`checkbox-${id}`}
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
}) => {
  let error;
  const validator = field.getValidator();
  if (validator) {
    try {
      validator.validate(id, value);
    } catch (validationError) {
      error = true;
      console.warn(validationError.message);
    }
  }
  return <Form.Field key={`field-${id}`} required={required} error={error}>
    <ConcertoLabel key={`label-${id}`} skip={skipLabel} name={applyDecoratorTitle(field)} htmlFor={id} />
    <Input
      id={id}
      type={type}
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange(
        { ...data, value: parseValue(data.value, field.getType()) },
        id
      )
      }
      key={`input-${id}`}
    />
  </Form.Field>;
};

export const ConcertoRelationship = ({
  id,
  field,
  readOnly,
  required,
  value,
  onFieldValueChange,
  skipLabel,
  type,
  relationshipProvider
}) => {
  let relationship;
  try {
    if (value) {
      relationship = Relationship.fromURI(field.getModelFile().getModelManager(), value);
    } else {
      relationship = Relationship.fromURI(field.getModelFile().getModelManager(), `resource:${field.getFullyQualifiedTypeName()}#resource1`);
    }
  } catch (err) {
    return ConcertoInput({
      id,
      field,
      readOnly,
      required,
      value,
      onFieldValueChange,
      skipLabel,
      type,
    });
  }

  const relationshipOptions = (relationshipProvider && relationshipProvider.getOptions)
    ? relationshipProvider.getOptions(field) : null;
  const relationshipEditor = relationshipOptions
    ? <ConcertoDropdown
      id={id}
      value={value}
      readOnly={readOnly}
      onFieldValueChange={onFieldValueChange}
      options={relationshipOptions}
      key={id}
    />
    : <Input
      type={type}
      label={<Label basic>{normalizeLabel(relationship.getType())}</Label>}
      labelPosition='right'
      readOnly={readOnly}
      value={relationship.getIdentifier()}
      onChange={(e, data) => {
        relationship.setIdentifier(data.value || 'resource1');
        return onFieldValueChange(
          { ...data, value: relationship.toURI() },
          id
        );
      }}
      key={id}
    />;

  return <Form.Field required={required} key={`field-${id}`}>
    <ConcertoLabel skip={skipLabel} name={applyDecoratorTitle(field)} key={`label-${id}`} />
    {relationshipEditor}
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
    <ConcertoLabel skip={skipLabel} name={applyDecoratorTitle(field)} htmlFor={id} />
    <DateTimeInput
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange(data, id)}
      dateTimeFormat={'YYYY-MM-DDTHH:mm:ss.sssZ'}
      key={id}
      id={id}
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
  <Form.Field key={`field-${id}`} required={required}>
    <ConcertoLabel name={applyDecoratorTitle(field)} />
    {children}
    <div className="arrayElement grid">
      <div />
      <Button
        key={`add-btn-${id}`}
        aria-label={`Add an element to ${normalizeLabel(`${id}`)}`}
        icon={<Popup
          content='Add an element'
          position='left center'
          trigger={<Icon name='add' />}
        />}
        disabled={readOnly}
        className='arrayButton'
        onClick={e => {
          addElement(e, id);
          e.preventDefault();
        }}
      />
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
  <div className="arrayElement grid" key={`array-${id}`}>
    <div key={`array-children-${id}`}>{children}</div>
    <Button
      icon={<Popup
        content='Remove this element'
        position='left center'
        key={`array-popup-${id}`}
        trigger={<Icon name='delete' key={`array-icon-${id}`} />}
      />}
      aria-label={`Remove element ${index} from ${normalizeLabel(`${id}`)}`}
      className='arrayButton'
      disabled={readOnly}
      onClick={e => {
        removeElement(e, id, index);
        e.preventDefault();
      }}
      key={`array-btn-${id}`}
    />
  </div>
);

export const ConcertoDropdown = ({
  id,
  readOnly,
  value,
  onFieldValueChange,
  options,
}) => !readOnly ? (
  <Select
    fluid
    value={value}
    onChange={(e, data) => onFieldValueChange(data, id)}
    key={`select-${id}`}
    options={options}
  />
) : (
    <Input type="text" readOnly value={value} key={`input-${id}`} />
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
