/* eslint-disable class-methods-use-this */
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
import get from 'lodash.get';
import { Form } from 'semantic-ui-react';
import ReactFormVisitor from './reactformvisitor';
import {
  ConcertoDropdown,
  ConcertoLabel,
} from './components/fields';
import {
  pathToString
} from './utilities';

const declarationTypes = [
  { value: 'concerto.metamodel.StringFieldDeclaration', text: 'Text' },
  { value: 'concerto.metamodel.IntegerFieldDeclaration', text: 'Whole Number' },
  { value: 'concerto.metamodel.BooleanFieldDeclaration', text: 'Boolean' },
  { value: 'concerto.metamodel.DateTimeFieldDeclaration', text: 'Date' },
  { value: 'concerto.metamodel.RealFieldDeclaration', text: 'Decimal' },
  { value: 'concerto.metamodel.ObjectFieldDeclaration', text: 'Object' },
  { value: 'concerto.metamodel.RelationshipDeclaration', text: 'Relationship' },
];

/**
 * Convert the contents of a ModelManager to React compnents.
 * @class
 */
class ModelBuilderVisitor extends ReactFormVisitor {
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitClassDeclaration(classDeclaration, parameters) {
    const fqn = classDeclaration.getFullyQualifiedName();
    if (fqn === 'concerto.metamodel.AssetDeclaration') {
      return this.visitMetaConceptDeclaration(classDeclaration, parameters);
    }

    if (fqn === 'concerto.metamodel.TypeIdentifier') {
      parameters.skipLabel = true;
      const component = super.visitClassDeclaration(classDeclaration, parameters);
      parameters.skipLabel = false;
      return component;
    }

    const declarationTypeNames = declarationTypes.map(({ value }) => value);
    if (declarationTypeNames.includes(fqn)) {
      return this.visitMetaFieldDeclaration(classDeclaration, parameters);
    }

    return super.visitClassDeclaration(classDeclaration, parameters);
  }

  visitMetaConceptDeclaration(declaration, parameters) {
    const props = declaration.getProperties();
    const identifier = props.find(({ name }) => name === 'identifier');
    const superType = props.find(({ name }) => name === 'superType');
    const fields = props.find(({ name }) => name === 'fields');

    return <div>
      <div className='mbIdentifierDeclaration'>
        <div>{identifier.accept(this, parameters)}</div>
        <div>{superType.accept(this, parameters)}</div>
      </div>
      <div className='mbFieldDeclarations'>
        {fields.accept(this, parameters)}
      </div>
    </div>;
  }

  visitMetaFieldDeclaration(declaration, parameters) {
    const props = declaration.getProperties();

    const name = props.find(({ name }) => name === 'name');
    const isOptional = props.find(({ name }) => name === 'isOptional');
    const isArray = props.find(({ name }) => name === 'isArray');
    let type;

    const key = pathToString(parameters.stack);
    const value = get(parameters.json, key);

    const hasTypeProperty = name => [
      'concerto.metamodel.ObjectFieldDeclaration',
      'concerto.metamodel.RelationshipDeclaration'
    ].includes(name);

    // Create a new concept
    if (value.$class) {
      const tempParts = value.$class.split('.');
      const tempName = tempParts.pop();
      const concept = parameters.modelManager
        .getFactory()
        .newConcept(tempParts.join('.'), tempName, undefined, {
          parameters: parameters.includeOptionalFields,
          generate: parameters.includeSampleData,
        });
      type = concept.getClassDeclaration().getProperties().find(({ name }) => name === 'type');
    }

    // We need a special version of `onFieldValueChange` because changing the $class value
    // requires us to regenerate the instance
    const onFieldValueChange = data => {
      const { value: newClassName } = data;

      // Add a new type property to the data
      if (hasTypeProperty(newClassName) && !hasTypeProperty(value.$class)) {
        const parts = newClassName.split('.');
        const name = parts.pop();

        // Create a new concept
        const concept = parameters.modelManager
          .getFactory()
          .newConcept(parts.join('.'), name, undefined, {
            parameters: parameters.includeOptionalFields,
            generate: parameters.includeSampleData,
          });

        // Keep any existing values
        const json = {
          ...parameters.modelManager.getSerializer().toJSON(concept),
          name: value.name,
          isOptional: value.isOptional,
          isArray: value.isArray,
        };
        value.type = json;

        parameters.onFieldValueChange({
          ...data,
          value: json
        }, key);
        return;
      }

      // Remove any old type properties
      value.type = undefined;
      value.$class = newClassName;
      parameters.onFieldValueChange({
        ...data,
        value,
      }, key);
    };

    return (
      <div className='mbObjectDeclaration' key={declaration.getName().toLowerCase()}>
        <div>{name.accept(this, parameters)}</div>
        <Form.Field required={true} key={'$class'}>
          <ConcertoLabel name='type' htmlFor={`${key}.$class`} />
          <ConcertoDropdown
            id={`${key}.$class`}
            key={key}
            value={value.$class}
            readOnly={parameters.disabled}
            onFieldValueChange={onFieldValueChange}
            options={declarationTypes.map(({ value, text }) => ({
              key: `option-${value}`,
              value,
              text,
            }))}
          />
        </Form.Field>
        <div>{type && type.accept(this, parameters)}</div>
        <div>{isArray.accept(this, parameters)}</div>
        <div>{isOptional.accept(this, parameters)}</div>
      </div>
    );
  }
}
export default ModelBuilderVisitor;
