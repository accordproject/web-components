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
import toPath from 'lodash.topath';
import { HTMLFormVisitor } from '@accordproject/concerto-ui-core';
import { 
  ConcertoInput,
  ConcertoArray,
  ConcertoArrayElement,
  ConcertoDropdown,
  ConcertoCheckbox,
  ConcertoDateTime,
  ConcertoLabel,
  Duration,
  MonetaryAmount
} from './components/fields';
import { hideProperty, findConcreteSubclass, getDefaultValue } from './utilities';
import { Form } from 'semantic-ui-react';

/**
 * Convert the contents of a ModelManager to React compnents.
 * @class
 */
class ReactFormVisitor extends HTMLFormVisitor {

  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitClassDeclaration(classDeclaration, parameters) {
    if(parameters.hideIdentifiers){
      if (!parameters.hiddenFields){
        parameters.hiddenFields = [];
      }

      const idFieldName = classDeclaration.getIdentifierFieldName()
      if (idFieldName){
        const idField = classDeclaration.getProperty(idFieldName)
        parameters.hiddenFields.push(idField.getFullyQualifiedName());
      }
    }

    if(classDeclaration.isSystemType() || classDeclaration.isAbstract()) {
      return null;
    }

    if ([
      'org.accordproject.money.MonetaryAmount',
      'org.accordproject.money.DigitalMonetaryAmount',
    ].includes(classDeclaration.getFullyQualifiedName())) {
      return this.visitMonetaryAmount(classDeclaration, parameters);
    } else if ([
      'org.accordproject.time.Duration',
      'org.accordproject.time.Period'
    ].includes(classDeclaration.getFullyQualifiedName())) {
      return this.visitDuration(classDeclaration, parameters);
    } else if ([
      'org.accordproject.cicero.contract.AccordParty',
    ].includes(classDeclaration.getFullyQualifiedName())) {
      return this.visitAccordParty(classDeclaration, parameters);
    }
    return classDeclaration.getProperties().map((p) => p.accept(this, parameters));
  }

  visitMonetaryAmount(declaration, parameters) {
    const props = declaration.getProperties();
    parameters.skipLabel = true;
    const component = <MonetaryAmount key={declaration.getName().toLowerCase()}>
      {props[0].accept(this, parameters)}{props[1].accept(this, parameters)}
    </MonetaryAmount>;
    parameters.skipLabel = false;
    return component;
  }

  visitDuration(declaration, parameters) {
    const props = declaration.getProperties();
    parameters.skipLabel = true;
    const component = <Duration key={declaration.getName().toLowerCase()}>
      {props[0].accept(this, parameters)}{props[1].accept(this, parameters)}
    </Duration>;
    parameters.skipLabel = false;
    return component;
  }

  visitAccordParty(declaration, parameters) {
    const props = declaration.getProperties();
    parameters.skipLabel = true;
    const component = <div>{props[0].accept(this, parameters)}</div>;
    parameters.skipLabel = false;
    return component;
  }

  /**
   * Visitor design pattern
   * @param {EnumDeclaration} enumDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitEnumDeclaration(enumDeclaration, parameters) {
    const key = toPath(parameters.stack);
    const value = get(parameters.json,key);

    return <ConcertoDropdown
      id={key}
      value={value}
      field={enumDeclaration}
      onFieldValueChange={parameters.onFieldValueChange}
      options={enumDeclaration.getProperties().map((property) => ({
        key: property.getName(),
        value: property.getName(),
        text: property.getName(),
      }))}
    />;
  }

    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
  visitField(field, parameters) {
    const { 
      readOnly, skipLabel, disabled, addElement, removeElement, onFieldValueChange, stack
     } = parameters;

    stack.push(field.getName());

    if(hideProperty(field, parameters)){
      return null;
    };

    let key = toPath(stack);
    let value = get(parameters.json,key);
    let component = null;

    const commonProps = {
      skipLabel: skipLabel || field.isArray(),
      id: key,
      field,
      value,
      type: this.toFieldType(field.getType()),
      required: !field.isOptional(),
      transparent: disabled,
      readOnly, disabled,
      addElement, removeElement, onFieldValueChange
    };

    if (field.isArray()) {
      component = <ConcertoArray {...commonProps}
        key={field.getName()+'_wrapper'} 
        addElement={(e, id) => addElement(e, id, getDefaultValue(field, parameters))}
      >
        { value && value.map((_element, index) => {
          stack.push(index);
          const arrayComponent = <ConcertoArrayElement 
            {...commonProps} 
            index={index}
            key={field.getName()+'_wrapper['+index+']'}
          >
            { this.visitSingletonField(field, parameters, commonProps) }
          </ConcertoArrayElement>;
          stack.pop();
          return arrayComponent;
        })}
      </ConcertoArray>;
    } else {
      component = this.visitSingletonField(field, parameters, commonProps);
    }
      stack.pop();
      return component;
    }

  /**
   * Visitor design pattern
   * @param {Field} field - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitSingletonField(field, parameters, props) {
    let key = toPath(parameters.stack);
    let value = get(parameters.json,key);
    if (field.isPrimitive()){
      if(field.getType() === 'Boolean'){
        return <ConcertoCheckbox {...props} id={key} value={value}/>;
      } else if(this.toFieldType(field.getType()) === 'datetime-local'){
        return <ConcertoDateTime {...props} id={key} value={value}/>;
      } else {
        return <ConcertoInput {...props} id={key} value={value}/>;
      }
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      type = findConcreteSubclass(type);
      return <Form.Field required={!field.isOptional()} key={field.getName()}>
          <ConcertoLabel skip={props.skipLabel} name={field.getName()} />
            {type.accept(this, parameters)}
        </Form.Field>;
    }
  }

  /**
   * Visitor design pattern
   * @param {Relationship} relationship - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitRelationship(relationship, parameters) {
    const { 
      readOnly, skipLabel, disabled, addElement, removeElement, onFieldValueChange, stack
    } = parameters;
    stack.push(relationship.getName());

    if(hideProperty(relationship, parameters)){
      return null;
    };

    const key = toPath(stack);
    let value = get(parameters.json,key);

    const commonProps = { 
      skipLabel: skipLabel || relationship.isArray(),
      id: key,
      field: relationship,
      value,
      type: 'text',
      required: !relationship.isOptional(),
      transparent: disabled,
      readOnly, disabled, addElement, removeElement, onFieldValueChange
    };

    let component;
    if (relationship.isArray()){
      component = <ConcertoArray {...commonProps}
        addElement={(e, id) => addElement(e, id, 'resource1')}
      >
        { value && value.map((_element, index) => {
          stack.push(index);
          let key = toPath(stack);
          let value = get(parameters.json,key);
          const arrayComponent = <ConcertoArrayElement {...commonProps} index={index}>
            <ConcertoInput {...commonProps} id={key} value={value}/>
            </ConcertoArrayElement>;
          stack.pop();
          return arrayComponent;
        })}
      </ConcertoArray>;
    } else {
      component = <ConcertoInput {...commonProps}/>;
    }

    stack.pop();
    return component;
  }
}

export default ReactFormVisitor;
