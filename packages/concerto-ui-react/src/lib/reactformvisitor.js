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
import { Utilities, HTMLFormVisitor } from '@accordproject/concerto-ui-core';

/**
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @private
 * @class
 * @memberof module:composer-common
 */
class ReactFormVisitor extends HTMLFormVisitor {

  /**
   * Helper function to determine whether to hide a property from the rendering
   * @param {Property} property - the object being visited, either a field or a resource
   * @param {Object} parameters  - the parameter
   * @return {boolean} - true if the property should be hidden, false otherwise
   * @private
   */
  hideProperty(property, parameters){
    if (parameters.hiddenFields && parameters.hiddenFields.find(
        f => {
          if (typeof f === 'function'){
            return f(property);
          }
          if (typeof f === 'string'){
            return f === property.getFullyQualifiedName()
          }
          return false;
        }
      )) {
      parameters.stack.pop();
      return true;
    }
    return false;
  }

  /**
   * Helper function to cast the string value of a change event to it's true type
   * @param {Event} e - the event associated with the field change
   * @return {Event} e - the modified event
   * @private
   */
  castChangeToPrimitiveType(e, key, type, parameters) {
    let change = e.target.value;
    switch(type) {
      case 'Boolean':
        change = change === 'true';
        break;
      case 'Double':
        change = parseFloat(change);
        break;
      case 'Long':
      case 'Integer':
        change = parseInt(change);
        break;
      }
      return parameters.onFieldValueChange({ ...e, target: { ...e.target, value: change }}, key)
  }

  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitClassDeclaration(classDeclaration, parameters) {
    let component = null;

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

    if(!classDeclaration.isSystemType() &&
        !classDeclaration.isAbstract()) {
      const id = classDeclaration.getName().toLowerCase();

      const renderClassDeclaration = (classDeclaration, parameters) => {
        if ([
          'org.accordproject.money.MonetaryAmount',
          'org.accordproject.money.DigitalMonetaryAmount',
        ].includes(classDeclaration.getFullyQualifiedName())) {
            return (
              <div key={id} name={classDeclaration.getName()}>
              {this.visitMonetaryAmount(classDeclaration, parameters)}
              </div>
            );
        } else if ([
          'org.accordproject.time.Duration',
          'org.accordproject.time.Period'
        ].includes(classDeclaration.getFullyQualifiedName())) {
            return (
              <div key={id} name={classDeclaration.getName()}>
              {this.visitDuration(classDeclaration, parameters)}
              </div>
            );
        } else if ([
          'org.accordproject.cicero.contract.AccordParty',
        ].includes(classDeclaration.getFullyQualifiedName())) {
            return (
              <div key={id} name={classDeclaration.getName()}>
              {this.flattenSingletonChild(classDeclaration, parameters)}
              </div>
            );
        }
        return (
          <div key={id} name={classDeclaration.getName()} className={parameters.customClasses.classElement} >
          {classDeclaration.getProperties().map((property) => {
            return property.accept(this,parameters);
          })}
          </div>
        );
      }

      // Is this class in an array or not?
      if(parameters.stack.length === 0) {
        component = (<div key={id}>
                        <div name={classDeclaration.getName()}>
                        {renderClassDeclaration(classDeclaration, parameters)}
                        </div>
                    </div>
                    );
      } else {
        component = renderClassDeclaration(classDeclaration, parameters);
      }
    }
    return component;
  }

  visitMonetaryAmount(amountDeclaration, parameters) {
    const props = amountDeclaration.getProperties();
    parameters.skipLabel = true;
    const component = ( 
      <div className='monetaryAmount'>
        <div>{props[0].accept(this, parameters)}</div>
        <div>{props[1].accept(this, parameters)}</div>
      </div>
    );
    parameters.skipLabel = false;
    return component;
  }

  visitDuration(amountDeclaration, parameters) {
    const props = amountDeclaration.getProperties();
    parameters.skipLabel = true;
    const component = ( 
      <div className='duration'>
        <div>{props[0].accept(this, parameters)}</div>
        <div>{props[1].accept(this, parameters)}</div>
      </div>
    );
    parameters.skipLabel = false;
    return component;
  }

  flattenSingletonChild(declaration, parameters) {
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
    let component = null;
    const key = toPath(parameters.stack);
    const value = get(parameters.json,key);

    const styles = parameters.customClasses;
    const id = enumDeclaration.getName().toLowerCase();
    component = (<div className={styles.field} key={id}>
          <select className={styles.enumeration}
            disabled={parameters.readOnly}
            value={value}
            onChange={(e)=>parameters.onFieldValueChange(e, key)}
            key={key} >
          {enumDeclaration.getProperties().map((property) => {
            return property.accept(this,parameters);
          })}
          </select>
        </div>);

    return component;
  }


    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
  visitField(field, parameters) {
    parameters.stack.push(field.getName());

    if(this.hideProperty(field, parameters)){
      return null;
    };

    let key = toPath(parameters.stack);
    let value = get(parameters.json,key);
    let component = null;

    const styles = parameters.customClasses;
    let style = styles.field;
    if(!field.isOptional()){
      style += ' ' + styles.required;
    }
    if(parameters.disabled){
      style += ' readonly transparent';
    }
    if (field.isArray()) {
      let arrayField = (field, parameters) => {
        let key = toPath(parameters.stack);
        let value = get(parameters.json,key);
        if (field.isPrimitive()){
          if(field.getType() === 'Boolean'){
            return(<div className={styles} key={field.getName()+'_wrapper'}>
                        <div className={styles.boolean}>
                            <input type="checkbox"
                            disabled={parameters.readOnly}
                            checked={value}
                            value={value}
                            onChange={(e)=>parameters.onFieldValueChange(e, key)}
                            key={key} />
                            <label/>
                        </div>
                    </div>);
          } else if(this.toFieldType(field.getType()) === 'datetime-local'){
            return (<div className={style} key={field.getName()+'_wrapper'}>
                        <input type={this.toFieldType(field.getType())}
                            className={styles.input}
                            readOnly={parameters.readOnly}
                            value={new Date(value).toDatetimeLocal()}
                            onChange={(e)=>parameters.onFieldValueChange(e, key)}
                            key={key} />
                    </div>);
          } else {
            return (<div className={style} key={field.getName()+'_wrapper'}>
                        <input type={this.toFieldType(field.getType())}
                            className={styles.input}
                            readOnly={parameters.readOnly}
                            value={value}
                            onChange={e => this.castChangeToPrimitiveType(e, key, field.getType(), parameters)}
                            key={key} />
                    </div>);
          }
        } else {
          let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
          type = this.findConcreteSubclass(type);
          return type.accept(this, parameters);
        }
      };

      let defaultValue =  null;
      if(field.isPrimitive()){
        defaultValue = this.convertToJSON(field);
      } else {
        let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
        type = this.findConcreteSubclass(type);
        if(type.isConcept()){
          const concept = parameters.modelManager.getFactory().newConcept(type.getNamespace(), type.getName(), { includeOptionalFields: true, generate: 'sample'});
          defaultValue = parameters.modelManager.getSerializer().toJSON(concept);
        } else {
          const resource = parameters.modelManager.getFactory().newResource(type.getNamespace(), type.getName(), 'resource1', { includeOptionalFields: true, generate: 'sample'});
          defaultValue = parameters.modelManager.getSerializer().toJSON(resource);
        }
      }

      component = (<div className={style} key={field.getName()+'_wrapper'}>
            { !parameters.skipLabel && <label>{Utilities.normalizeLabel(field.getName())}</label> }
              {value ? value.map((element, index) => {
                parameters.stack.push(index);
                const arrayComponent = (
                  <div className={styles.arrayElement + ' grid'} key={field.getName()+'_wrapper['+index+']'}>
                      <div >
                        {arrayField(field, parameters)}
                      </div>
                      <div>                          
                        <button
                          disabled={parameters.readOnly}
                          className={styles.button + ' negative icon'}
                          onClick={(e)=>{parameters.removeElement(e, key, index);e.preventDefault();}}>
                            <i className="times icon"></i>
                        </button>
                      </div>
                  </div>
                );
                parameters.stack.pop();
                return arrayComponent;
              }): null}
              <div className={styles.arrayElement + ' grid'}>
                <div/>
                <div>                          
                  <button
                    disabled={parameters.readOnly}
                    className={styles.button + ' positive icon'}
                    onClick={(e)=>{parameters.addElement(e, key, defaultValue);e.preventDefault();}}>
                      <i className="plus icon"></i>
                  </button>
                </div>
              </div>
            </div>);
    } else if (field.isPrimitive()) {
      if(field.getType() === 'Boolean'){
        component = (<div className={style} key={field.getName()+'_wrapper'}>
                  { !parameters.skipLabel && <label>{Utilities.normalizeLabel(field.getName())}</label> }
                  <div className={styles.boolean}>
                      <input type="checkbox"
                      disabled={parameters.readOnly}
                      checked={value}
                      value={value}
                      onChange={(e)=>parameters.onFieldValueChange(e, key)}
                      key={key} />
                      <label/>
                  </div>
              </div>);
      } else if(this.toFieldType(field.getType()) === 'datetime-local'){
        component = (<div className={style} key={field.getName()+'_wrapper'}>
                  { !parameters.skipLabel && <label>{Utilities.normalizeLabel(field.getName())}</label> }
                  <input type={this.toFieldType(field.getType())}
                      className={styles.input}
                      readOnly={parameters.readOnly}
                      value={new Date(value).toDatetimeLocal()}
                      onChange={(e)=>parameters.onFieldValueChange(e, key)}
                      key={key} />
              </div>);
      } else {
        component = (<div className={style} key={field.getName()+'_wrapper'}>
                  { !parameters.skipLabel && <label>{Utilities.normalizeLabel(field.getName())}</label> }
                  <input type={this.toFieldType(field.getType())}
                      className={styles.input}
                      readOnly={parameters.readOnly}
                      value={value}
                      onChange={e => this.castChangeToPrimitiveType(e, key, field.getType(), parameters)}
                      key={key} />
              </div>);
      }
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      type = this.findConcreteSubclass(type);
      component = (<div className={style} key={field.getName()}>
                { !parameters.skipLabel && <label>{Utilities.normalizeLabel(field.getName())}</label> }
                {type.accept(this, parameters)}
            </div>);
    }

    parameters.stack.pop();
    return component;
  }

    /**
     * Visitor design pattern
     * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
  visitEnumValueDeclaration(enumValueDeclaration, parameters) {
    return <option key={enumValueDeclaration.getName()} value={enumValueDeclaration.getName()}>{enumValueDeclaration.getName()}</option>;
  }

    /**
     * Visitor design pattern
     * @param {Relationship} relationship - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
  visitRelationship(relationship, parameters) {
    parameters.stack.push(relationship.getName());

    if(this.hideProperty(relationship, parameters)){
      return null;
    };

    const styles = parameters.customClasses;
    let fieldStyle = styles.field;
    if(!relationship.isOptional()){
      fieldStyle += ' ' + styles.required;
    }
    if(parameters.disabled){
      fieldStyle += ' readonly transparent';
    }

    const key = toPath(parameters.stack);
    let value = get(parameters.json,key);

    let component;
    if (relationship.isArray()){
      if(!value){ return null; }
      let arrayField = (field, parameters) => {
        let key = toPath(parameters.stack);
        let value = get(parameters.json,key);
        return (<input type='text'
          className={styles.input}
          readOnly={parameters.readOnly}
          value={value}
          onChange={(e)=>parameters.onFieldValueChange(e, key)}
          key={key} />);
      };
      component = (<div className={fieldStyle} key={relationship.getName()+'_wrapper'}>
      { !parameters.skipLabel && <label>{Utilities.normalizeLabel(relationship.getName())}</label> }
        {value.map((element, index) => {
          parameters.stack.push(index);
          const arrayComponent = (
            <div className={styles.arrayElement + ' grid'} key={relationship.getName()+'_wrapper['+index+']'}>
                <div >
                  {arrayField(relationship, parameters)}
                </div>
                <div>                          
                  <button
                   disabled={parameters.readOnly}
                    className={styles.button + ' negative icon'}
                    onClick={(e)=>{parameters.removeElement(e, key, index);e.preventDefault();}}>
                      <i className="times icon"></i>
                  </button>
                </div>
            </div>
          );
          parameters.stack.pop();
          return arrayComponent;
        })}
        <div className={styles.arrayElement + ' grid'}>
          <div/>
          <div>                          
            <button
              disabled={parameters.readOnly}
              className={styles.button + ' positive icon'}
              onClick={(e)=>{parameters.addElement(e, key, 'resource1');e.preventDefault();}}>
                <i className="plus icon"></i>
            </button>
          </div>
        </div>
      </div>);
    } else {
      component = (<div className={fieldStyle} key={relationship.getName()}>
      <label>{Utilities.normalizeLabel(relationship.getName())}</label>
      <input
          type='text'
          className={styles.input}
          readOnly={parameters.readOnly}
          value={value}
          onChange={(e)=>parameters.onFieldValueChange(e, key)}
          key={key}
          />
      </div>);
    }

    parameters.stack.pop();
    return component;
  }

  /**
   * Find a concrete type that extends the provided type. If the supplied type argument is
   * not abstract then it will be returned.
   * TODO: work out whether this has to be a leaf node or whether the closest type can be used
   * It depends really since the closest type will satisfy the model but whether it satisfies
   * any transaction code which attempts to use the generated resource is another matter.
   * @param {ClassDeclaration} declaration the class declaration.
   * @return {ClassDeclaration} the closest extending concrete class definition.
   * @throws {Error} if no concrete subclasses exist.
   */
  findConcreteSubclass(declaration) {
    if (!declaration.isAbstract()) {
      return declaration;
    }

    const concreteSubclasses = declaration.getAssignableClassDeclarations()
            .filter(subclass => !subclass.isAbstract())
            .filter(subclass => !subclass.isSystemType());

    if (concreteSubclasses.length === 0) {
      throw new Error('No concrete subclasses found');
    }

    return concreteSubclasses[0];
  }

  /**
   * Converts to JSON safe format.
   *
   * @param {Field} field - the field declaration of the object
   * @return {Object} the text JSON safe representation
   */
  convertToJSON(field) {
    switch (field.getType()) {
    case 'DateTime':
      {
        return new Date().toISOString();
      }
    case 'Integer':
      return 0;
    case 'Long':
    case 'Double':
      return 0.0;
    case 'Boolean':
      return false;
    default:
      return '';
    }
  }
}

Date.prototype.toDatetimeLocal =
  function toDatetimeLocal() {
    let
      date = this,
      ten = function (i) {
        return (i < 10 ? '0' : '') + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds())
      ;
    return YYYY + '-' + MM + '-' + DD + 'T' +
             HH + ':' + II + ':' + SS;
  };

export default ReactFormVisitor;
